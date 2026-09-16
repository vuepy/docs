#!/usr/bin/env python3
"""遍历目录中的 .vue，按同名 .play.json 用 asciinema 录制交互，导出同名 .cast.txt。

    overview_event_handling.vue
    overview_event_handling.play.json   # 交互脚本（探测目标 + 步骤）
    ->  overview_event_handling.cast.txt    # asciinema 录屏
    ->  overview_event_handling.cast.json   # asciinema-player 的 markers

没有 .play.json 的 .vue 会被跳过（静态截图走 render_textual_vuepy_svgs.py）。

asciinema 只在 stdin/stdout 是真实 tty 时才转发按键，所以这里自己开一个 pty 运行
asciinema，再把按键 / SGR 鼠标序列写进 pty master，由 asciinema 转发给被录制的
Textual 应用。点击坐标先用 Textual 的 headless ``run_test`` 以相同尺寸和 cwd 探测，
避免示例布局调整后坐标失效。

.play.json 格式::

    {
      "size": "100x30",            // 可选，默认 100x30
      "cwd": ".",                  // 可选，相对 .vue 所在目录
      "probe_settle": 0.4,         // 可选，探测前的等待（等异步加载）
      "targets": {
        "input": {"query": "Input", "anchor": "topleft", "dx": 2, "dy": 1},
        "tree_file": {"query": "DirectoryTree", "anchor": "topleft",
                      "row": "first_file", "dx": 4},
        "box": {"query": "VBox"},
        "corner": {"xy": [80, 20]}   // 也可以直接写屏幕坐标
      },
      "steps": [
        {"wait": 1.5, "marker": "启动应用"},
        {"click": "input", "marker": "@input_submitted"},
        {"type": "hello"},
        {"key": "enter", "delay": 0.5},
        {"key": "ctrl+q", "marker": "退出"}
      ]
    }

用法::

    python scripts/render_textual_vuepy_asciinema.py
    python scripts/render_textual_vuepy_asciinema.py src/textual_vuepy
    python scripts/render_textual_vuepy_asciinema.py --only overview_event_handling
    python scripts/render_textual_vuepy_asciinema.py --mirror   # 同时回显，便于调试
"""

from __future__ import annotations

import argparse
import asyncio
import contextlib
import dataclasses
import fcntl
import json
import os
import shlex
import shutil
import struct
import subprocess
import sys
import termios
import threading
import time
import traceback
from pathlib import Path

DEFAULT_ROOT = Path(__file__).resolve().parent.parent / "src" / "textual_vuepy"
DEFAULT_SIZE = (100, 30)
PLAY_SUFFIX = ".play.json"


def parse_size(value: str) -> tuple[int, int]:
    try:
        cols, rows = value.lower().split("x", 1)
        return int(cols), int(rows)
    except Exception as exc:
        raise argparse.ArgumentTypeError(
            f"size must be COLSxROWS, e.g. 100x30; got {value!r}"
        ) from exc


def build_env() -> dict[str, str]:
    env = dict(os.environ)
    # Cursor/CI 常设 NO_COLOR=1，会让 Textual 进入灰度模式
    env.pop("NO_COLOR", None)
    env["TERM"] = "xterm-256color"
    env.setdefault("COLORTERM", "truecolor")
    return env


@contextlib.contextmanager
def chdir(path: Path):
    old = Path.cwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(old)


# --------------------------------------------------------------------------
# 目标解析：把 .play.json 里的 query 解析成终端坐标
# --------------------------------------------------------------------------

def _anchor_point(region, anchor: str) -> tuple[int, int]:
    """返回 0-based 屏幕坐标。"""
    if anchor == "center":
        return region.x + region.width // 2, region.y + region.height // 2
    if anchor == "topleft":
        return region.x, region.y
    if anchor == "topright":
        return region.x + region.width - 1, region.y
    if anchor == "bottomleft":
        return region.x, region.y + region.height - 1
    if anchor == "bottomright":
        return region.x + region.width - 1, region.y + region.height - 1
    raise ValueError(f"未知 anchor: {anchor!r}")


def _first_file_line(tree) -> int:
    """DirectoryTree 中第一个普通文件所在的行号（目录排在文件前面）。"""
    for line, tree_line in enumerate(tree._tree_lines):
        path = getattr(tree_line.node.data, "path", None)
        if path is not None and path.is_file():
            return line
    raise RuntimeError(f"DirectoryTree 中没有文件可点击（cwd={Path.cwd()}）")


ROW_PROBES = {
    # 需要按内容定位行号的场景，返回控件内的行偏移
    "first_file": _first_file_line,
}


def resolve_target(screen, spec: dict) -> tuple[int, int]:
    """把一个 target 规格解析成当前布局下的 0-based 屏幕坐标 (col, row)。"""
    if "xy" in spec:  # 直接给屏幕坐标，用于不依附控件的鼠标轨迹
        col, row = spec["xy"]
        return int(col), int(row)

    widget = screen.query(spec["query"])[spec.get("nth", 0)]
    col, row = _anchor_point(widget.region, spec.get("anchor", "center"))

    row_probe = spec.get("row")
    if row_probe:
        line = ROW_PROBES[row_probe](widget)
        row = widget.region.y + line - widget.scroll_offset.y

    col += spec.get("dx", 0)
    row += spec.get("dy", 0)
    return _snap_to_hit(screen, widget, col, row)


def _receives_click(screen, widget, col: int, row: int) -> bool:
    """(col, row) 上的点击最终会不会落到 widget（或它的子控件）身上。"""
    try:
        hit, _ = screen.get_widget_at(col, row)
    except Exception:
        return False
    while hit is not None:
        if hit is widget:
            return True
        hit = hit.parent
    return False


def _snap_to_hit(screen, widget, col: int, row: int) -> tuple[int, int]:
    """控件被容器裁掉时，把落点挪到 region 里真正可点的那一格。

    典型例子是对话框里 height 3 的按钮只露出第一行：region 仍报 3 行高，按中心
    取点会打在外层容器上，点击也就没有反应。
    """
    region = widget.region
    if _receives_click(screen, widget, col, row):
        return col, row
    if not region.contains(col, row):
        return col, row  # 落点本来就在控件外（比如刻意偏移），按原样用

    rows = sorted(range(region.y, region.y + region.height), key=lambda r: abs(r - row))
    cols = sorted(range(region.x, region.x + region.width), key=lambda c: abs(c - col))
    for r in rows:
        for c in cols:
            if _receives_click(screen, widget, c, r):
                return c, r

    raise RuntimeError(
        f"{widget!r} 在 {region} 内没有可点击的位置（可能被容器完全遮挡）"
    )


# --------------------------------------------------------------------------
# 步骤编译：.play.json 的 steps -> 待注入的输入序列
# --------------------------------------------------------------------------

@dataclasses.dataclass
class Step:
    """一次输入注入：先等 ``delay`` 秒，再把 ``data`` 写进 pty。

    ``marker`` 不为空时，会在写入时刻打一个 asciinema-player 章节标记。
    """

    delay: float
    data: bytes = b""
    marker: str | None = None


NAMED_KEYS = {
    "enter": b"\r",
    "tab": b"\t",
    "escape": b"\x1b",
    "space": b" ",
    "backspace": b"\x7f",
    "delete": b"\x1b[3~",
    "up": b"\x1b[A",
    "down": b"\x1b[B",
    "right": b"\x1b[C",
    "left": b"\x1b[D",
    "home": b"\x1b[H",
    "end": b"\x1b[F",
    "pageup": b"\x1b[5~",
    "pagedown": b"\x1b[6~",
}


def key_bytes(name: str) -> bytes:
    key = name.strip().lower()
    if key in NAMED_KEYS:
        return NAMED_KEYS[key]
    if key.startswith("ctrl+") and len(key) == 6 and key[5].isalpha():
        return bytes([ord(key[5]) - ord("a") + 1])
    if len(key) == 1:
        return key.encode()
    raise ValueError(f"未知按键: {name!r}")


def _sgr_mouse(code: int, col: int, row: int, *, release: bool = False) -> bytes:
    """SGR(1006) 鼠标序列，入参 0-based，序列用 1-based。"""
    return f"\x1b[<{code};{col + 1};{row + 1}{'m' if release else 'M'}".encode()


MOUSE_MOVE = 35  # 32(motion) + 3(no button)


def mouse_move(col: int, row: int, marker: str | None = None, delay: float = 0.30) -> Step:
    return Step(delay, _sgr_mouse(MOUSE_MOVE, col, row), marker)


def mouse_click(col: int, row: int, marker: str | None = None) -> list[Step]:
    """SGR(1006) 鼠标：移动 -> 按下 -> 抬起。"""
    return [
        mouse_move(col, row, marker),
        Step(0.35, _sgr_mouse(0, col, row)),  # left press
        Step(0.12, _sgr_mouse(0, col, row, release=True)),  # left release -> mouse_up
    ]


def compile_step(raw: dict, coords: tuple[int, int] | None) -> list[Step]:
    """把一条 .play.json 步骤展开成若干次输入注入。"""
    marker = raw.get("marker")

    if "wait" in raw:
        return [Step(float(raw["wait"]), b"", marker)]
    if "click" in raw:
        return mouse_click(*coords, marker=marker)
    if "move" in raw:
        return [mouse_move(*coords, marker, raw.get("delay", 0.30))]
    if "type" in raw:
        delay = raw.get("delay", 0.08)
        return [
            Step(delay, ch.encode(), marker if i == 0 else None)
            for i, ch in enumerate(str(raw["type"]))
        ]
    if "key" in raw:
        return [Step(raw.get("delay", 0.2), key_bytes(raw["key"]), marker)]
    if "send" in raw:
        return [Step(raw.get("delay", 0.2), str(raw["send"]).encode(), marker)]
    raise ValueError(f"无法识别的 step: {raw!r}")


# --------------------------------------------------------------------------
# 探测：headless 重放一遍交互，边走边量坐标
# --------------------------------------------------------------------------

def probe_and_compile(vue_path: Path, size: tuple[int, int], play: dict) -> list[Step]:
    """返回录制时要注入 pty 的完整输入序列。

    坐标必须在「该步骤真正发生时」测量：对话框、切换后的标签页这类控件在启动瞬间
    还没有布局，一次性提前探测只会拿到空 region。因此这里用 Pilot 把整套交互在
    headless 会话里走一遍，每到一个点击/悬停步骤就按当时的布局取坐标。
    """
    from vuepy import create_app, import_sfc

    targets = play.get("targets", {})
    settle = play.get("probe_settle", 0.4)
    # 演示里的停顿是给观众看的，探测时只需等到布局稳定
    max_wait = play.get("probe_max_wait", 0.3)

    async def _run() -> list[Step]:
        vue_app = create_app(import_sfc(vue_path), backend="textual")
        vue_app.mount(run=False)
        tt_app = vue_app.tt_app

        steps: list[Step] = []
        async with tt_app.run_test(size=size) as pilot:
            await pilot.pause(settle)
            live = True  # 应用是否还在跑（ctrl+q 之后就不能再重放了）

            for raw in play.get("steps", []):
                name = raw.get("click") or raw.get("move")
                coords = None
                if name:
                    if not live:
                        raise RuntimeError(f"应用已退出，无法定位 {name!r}")
                    coords = resolve_target(tt_app.screen, targets[name])
                    print(f"    {name}: col={coords[0]} row={coords[1]}")

                steps += compile_step(raw, coords)
                if live:
                    live = await _replay(pilot, raw, coords, max_wait)

        return steps

    return asyncio.run(_run())


async def _replay(pilot, raw: dict, coords, max_wait: float) -> bool:
    """在 headless 会话里重放一步，返回应用是否还活着。"""
    try:
        if "click" in raw:
            await pilot.click(offset=coords)
        elif "move" in raw:
            await pilot.hover(offset=coords)
        elif "type" in raw:
            await pilot.press(*str(raw["type"]))
        elif "key" in raw:
            await pilot.press(raw["key"].strip().lower())
        elif "wait" in raw:
            await pilot.pause(min(float(raw["wait"]), max_wait))
        await pilot.pause()
    except Exception:
        # ctrl+q 之类会直接结束应用；只要后面不再需要定位控件就不影响录制
        return False
    return True


# --------------------------------------------------------------------------
# 录制
# --------------------------------------------------------------------------

def _set_winsize(fd: int, cols: int, rows: int) -> None:
    fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", rows, cols, 0, 0))


class _OutputDrain(threading.Thread):
    """持续读走子进程输出，否则 pty 缓冲写满会让被录制进程卡住。

    同时记录首个输出字节的时刻，用于把 marker 的挂钟时间对齐到 cast 时间轴。
    """

    def __init__(self, master_fd: int, mirror: bool) -> None:
        super().__init__(daemon=True)
        self.master_fd = master_fd
        self.mirror = mirror
        self.first_output_at: float | None = None

    def run(self) -> None:
        out = sys.stdout.buffer
        while True:
            try:
                data = os.read(self.master_fd, 65536)
            except OSError:
                break
            if not data:
                break
            if self.first_output_at is None:
                self.first_output_at = time.monotonic()
            if self.mirror:
                out.write(data)
                out.flush()


def record(
    vue_path: Path,
    cast_path: Path,
    size: tuple[int, int],
    steps: list[Step],
    *,
    cwd: Path,
    mirror: bool,
    timeout: float,
) -> tuple[int, list[tuple[float, str]]]:
    """执行录制，返回 (退出码, [(cast 时间, marker 标签)])。"""
    asciinema_bin = shutil.which("asciinema")
    if asciinema_bin is None:
        raise SystemExit(
            "can't find asciinema, please install it: apt install asciinema / pip install asciinema / brew install asciinema"
        )

    cols, rows = size
    inner_cmd = [sys.executable, "-m", "vuepy", "run", str(vue_path), "--backend", "textual"]
    cmd = [
        asciinema_bin,
        "rec",
        "--quiet",
        "--overwrite",
        "--title",
        vue_path.stem,
        "--command",
        shlex.join(inner_cmd),
        str(cast_path),
    ]

    master_fd, slave_fd = os.openpty()
    _set_winsize(slave_fd, cols, rows)

    proc = subprocess.Popen(
        cmd,
        stdin=slave_fd,
        stdout=slave_fd,
        stderr=slave_fd,
        cwd=cwd,
        env=build_env(),
        close_fds=True,
        start_new_session=True,
    )
    os.close(slave_fd)

    spawned_at = time.monotonic()
    reader = _OutputDrain(master_fd, mirror)
    reader.start()

    marked: list[tuple[float, str]] = []
    try:
        for step in steps:
            if proc.poll() is not None:
                break
            time.sleep(step.delay)
            if step.marker:
                marked.append((time.monotonic(), step.marker))
            if step.data:
                os.write(master_fd, step.data)
        try:
            proc.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            print("  超时未退出，终止 asciinema", file=sys.stderr)
            proc.terminate()
            proc.wait(timeout=5)
    finally:
        os.close(master_fd)
        reader.join(timeout=2)

    origin = _cast_time_origin(cast_path, reader.first_output_at, spawned_at)
    markers = [(round(max(0.0, at - origin), 3), label) for at, label in marked]
    return proc.returncode or 0, markers


def _cast_time_origin(
    cast_path: Path, first_output_at: float | None, spawned_at: float
) -> float:
    """返回 cast 时间 0 对应的 monotonic 时刻。

    asciinema 启动自身解释器需要一点时间，直接用 spawn 时刻会让 marker 整体偏后。
    改用「首个输出字节的 monotonic 时刻」与「cast 内首个事件时间」做对齐。
    """
    if first_output_at is None:
        return spawned_at
    try:
        with cast_path.open(encoding="utf-8") as fp:
            fp.readline()  # header
            for line in fp:
                if line.strip():
                    return first_output_at - json.loads(line)[0]
    except (OSError, ValueError, IndexError):
        pass
    return first_output_at


def write_markers(markers_path: Path, markers: list[tuple[float, str]]) -> None:
    """写出 asciinema-player 的 markers 选项数据。"""
    payload = {"markers": [[at, label] for at, label in markers]}
    markers_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


# --------------------------------------------------------------------------
# 遍历
# --------------------------------------------------------------------------

def record_one(
    vue_path: Path,
    play: dict,
    *,
    size_override: tuple[int, int] | None,
    mirror: bool,
    timeout: float,
) -> Path:
    size = size_override or (
        parse_size(play["size"]) if "size" in play else DEFAULT_SIZE
    )
    cwd = (vue_path.parent / play.get("cwd", ".")).resolve()
    cast_path = vue_path.with_suffix(".cast.txt")

    # .vue 里可能有 path="./" 之类的相对路径，探测与录制必须使用同一个 cwd
    with chdir(cwd):
        steps = probe_and_compile(vue_path, size, play)

    code, markers = record(
        vue_path, cast_path, size, steps, cwd=cwd, mirror=mirror, timeout=timeout
    )
    if not cast_path.exists():
        raise RuntimeError(f"asciinema 未生成 {cast_path.name}（exit={code}）")

    write_markers(vue_path.with_suffix(".cast.json"), markers)
    for at, label in markers:
        print(f"    marker {at:6.2f}s  {label}")
    return cast_path


def collect_plays(root: Path, only: str | None) -> list[tuple[Path, Path]]:
    """返回 [(vue_path, play_path)]，只保留有 .play.json 的 .vue。"""
    vue_files = [root] if root.is_file() else sorted(root.rglob("*.vue"))
    pairs = []
    for vue_path in vue_files:
        if only and only not in vue_path.stem:
            continue
        play_path = vue_path.with_suffix(PLAY_SUFFIX)
        if play_path.exists():
            pairs.append((vue_path, play_path))
    return pairs


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="按 .play.json 用 asciinema 录制 textual-vuepy 示例交互",
    )
    parser.add_argument("root", nargs="?", type=Path, default=DEFAULT_ROOT,
                        help=f"含 .vue 的目录或单个 .vue（默认: {DEFAULT_ROOT}）")
    parser.add_argument("--only", type=str, default=None,
                        help="只处理文件名包含该子串的示例")
    parser.add_argument("--size", type=parse_size, default=None,
                        help="覆盖 .play.json 里的终端尺寸 COLSxROWS")
    parser.add_argument("--mirror", action="store_true",
                        help="把录制内容同时打印到当前终端（便于调试）")
    parser.add_argument("--timeout", type=float, default=120.0,
                        help="等待单个录制进程退出的秒数（默认: 120）")
    parser.add_argument("--dry-run", action="store_true",
                        help="只列出将要录制的示例")
    parser.add_argument("--fail-fast", action="store_true",
                        help="遇到第一个失败即停止（默认继续）")
    args = parser.parse_args(argv)

    root = args.root.resolve()
    if not root.exists():
        print(f"路径不存在: {root}", file=sys.stderr)
        return 1

    pairs = collect_plays(root, args.only)
    if not pairs:
        print(f"未找到带 {PLAY_SUFFIX} 的 .vue（root={root}）", file=sys.stderr)
        return 1

    print(f"Found {len(pairs)} playable demo(s) under {root}")
    ok = 0
    failed: list[tuple[Path, str]] = []

    for vue_path, play_path in pairs:
        if args.dry_run:
            print(f"  would record: {vue_path.name} ({play_path.name})")
            ok += 1
            continue

        print(f"  {vue_path.name}")
        try:
            play = json.loads(play_path.read_text(encoding="utf-8"))
            cast_path = record_one(
                vue_path,
                play,
                size_override=args.size,
                mirror=args.mirror,
                timeout=args.timeout,
            )
            print(f"    wrote: {cast_path.name} ({cast_path.stat().st_size} bytes)")
            ok += 1
        except Exception as exc:
            failed.append((vue_path, str(exc)))
            print(f"    FAIL: {exc}", file=sys.stderr)
            if args.fail_fast:
                traceback.print_exc()
                break

    print(f"\nDone: {ok} ok, {len(failed)} failed.")
    if failed:
        print("Failed demos:", file=sys.stderr)
        for path, err in failed:
            print(f"  - {path.name}: {err}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
