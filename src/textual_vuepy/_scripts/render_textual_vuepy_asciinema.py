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

    # 默认遍历脚本所在的 src/textual_vuepy
    python src/textual_vuepy/_scripts/render_textual_vuepy_asciinema.py
    python src/textual_vuepy/_scripts/render_textual_vuepy_asciinema.py src/textual_vuepy/overview
    python src/textual_vuepy/_scripts/render_textual_vuepy_asciinema.py --only overview_event_handling
    python src/textual_vuepy/_scripts/render_textual_vuepy_asciinema.py --mirror   # 同时回显，便于调试
"""

from __future__ import annotations

import argparse
import asyncio
import bisect
import contextlib
import dataclasses
import fcntl
import json
import os
import shlex
import shutil
import statistics
import struct
import subprocess
import sys
import termios
import threading
import time
import traceback
from pathlib import Path

DEFAULT_ROOT = Path(__file__).resolve().parent.parent
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
    col, row = _snap_to_hit(screen, widget, col, row)
    # headless 探测看不到 ToastRack，但真实 tty 上 app.message / notify 会盖住右下角
    return _avoid_toast_zone(screen, widget, col, row)


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


# ToastRack: dock bottom + align right。单条 toast 约半屏宽，两条叠起来约占底 6 行。
_TOAST_ZONE_ROWS = 6
_TOAST_ZONE_COLS = 52


def _in_toast_zone(screen, col: int, row: int) -> bool:
    size = screen.size
    return row >= size.height - _TOAST_ZONE_ROWS and col >= size.width - _TOAST_ZONE_COLS


def _avoid_toast_zone(screen, widget, col: int, row: int) -> tuple[int, int]:
    """真实录制时 notify toast 会挡住右下角；若落点落在该区域，挪到控件上仍露出的格子。"""
    if not _in_toast_zone(screen, col, row):
        return col, row
    region = widget.region
    candidates: list[tuple[int, int, int]] = []
    for r in range(region.y, region.y + region.height):
        for c in range(region.x, region.x + region.width):
            if _in_toast_zone(screen, c, r):
                continue
            if _receives_click(screen, widget, c, r):
                candidates.append((abs(r - row) + abs(c - col), c, r))
    if not candidates:
        return col, row
    candidates.sort()
    _, c, r = candidates[0]
    return c, r


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


def _become_session_leader() -> None:
    """新建会话，并把 stdin 的 pty 认领为控制终端。

    只 setsid 而不认领控制终端时，asciinema 3 打不开 /dev/tty，会自动降级成
    headless：不读 stdin，注入的按键 / 鼠标序列全部丢失（应用也就永远不退出）。
    """
    os.setsid()
    with contextlib.suppress(OSError, AttributeError):
        fcntl.ioctl(0, termios.TIOCSCTTY, 0)


def _asciinema_major(asciinema_bin: str) -> int:
    """asciinema 主版本号，取不到时按 2 处理（不传 3.x 才有的参数）。"""
    try:
        out = subprocess.run(
            [asciinema_bin, "--version"], capture_output=True, text=True, timeout=10
        ).stdout
        return int(out.strip().split()[-1].split(".")[0])
    except Exception:
        return 2


CHUNK_LOG_LIMIT = 8 << 20  # 读取记录的字节上限，够长的录屏也只有几百 KB


class _OutputDrain(threading.Thread):
    """持续读走子进程输出，否则 pty 缓冲写满会让被录制进程卡住。

    同时按 (monotonic, bytes) 记录每次读到的输出，用于把 marker 的挂钟时间对齐
    到 cast 时间轴（见 :func:`_cast_time_origin`）。
    """

    def __init__(self, master_fd: int, mirror: bool) -> None:
        super().__init__(daemon=True)
        self.master_fd = master_fd
        self.mirror = mirror
        self.first_output_at: float | None = None
        self.chunks: list[tuple[float, bytes]] = []
        self._logged = 0

    def run(self) -> None:
        out = sys.stdout.buffer
        while True:
            try:
                data = os.read(self.master_fd, 65536)
            except OSError:
                break
            if not data:
                break
            now = time.monotonic()
            if self.first_output_at is None:
                self.first_output_at = now
            if self._logged < CHUNK_LOG_LIMIT:
                self.chunks.append((now, data))
                self._logged += len(data)
            else:
                print(f"warning: too many output bytes, dropped {len(data)} bytes", file=sys.stderr)
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
    # cwd 已是 .vue 所在目录，用文件名即可，避免 cast 头里写入本机绝对路径
    vue_arg = (
        vue_path.name
        if vue_path.resolve().parent == cwd.resolve()
        else str(vue_path)
    )
    inner_cmd = [sys.executable, "-m", "vuepy", "run", vue_arg, "--backend", "textual"]
    cmd = [
        asciinema_bin,
        "rec",
        "--quiet",
        "--overwrite",
        "--title",
        vue_path.stem,
        "--command",
        shlex.join(inner_cmd),
    ]
    if _asciinema_major(asciinema_bin) >= 3:
        # 3.x 会按 .txt 后缀选 txt 格式，而播放器读的是 asciicast v2
        cmd += ["--output-format", "asciicast-v2"]
    cmd.append(str(cast_path))

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
        preexec_fn=_become_session_leader,
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

    events = read_cast_output_events(cast_path)
    origin = _cast_time_origin(events, reader, spawned_at)
    markers = [(max(0.0, at - origin), label) for at, label in marked]
    return proc.returncode or 0, snap_markers_to_frames(markers, events)


def read_cast_output_events(cast_path: Path) -> list[tuple[float, bytes]]:
    """读出 cast 里的输出事件 [(cast 时间, 原始字节)]。"""
    events: list[tuple[float, bytes]] = []
    try:
        with cast_path.open(encoding="utf-8") as fp:
            fp.readline()  # header
            for line in fp:
                line = line.strip()
                if not line:
                    continue
                try:
                    at, kind, data = json.loads(line)
                except (ValueError, IndexError):
                    continue
                if kind == "o":
                    events.append((float(at), str(data).encode("utf-8", "replace")))
    except OSError:
        return []
    return events


# 短小的输出（单个 \r 之类）在流里到处都能匹配上，对齐时只用足够长的事件
MIN_ALIGN_BYTES = 16
MIN_ALIGN_SAMPLES = 3


def _cast_time_origin(
    events: list[tuple[float, bytes]], reader: "_OutputDrain", spawned_at: float
) -> float:
    """返回 cast 时间 0 对应的 monotonic 时刻。

    asciinema 自己也会往 stdout 写一些不进 cast 的初始化序列，所以「首个读到的
    字节」并不是「cast 里首个事件」，按它对齐会让 marker 整体偏后一秒左右。这里
    改成按**输出内容**匹配：在读到的字节流里依次定位每个 cast 事件，用「读到该事件
    的时刻 - 事件的 cast 时间」的中位数当原点，对个别没匹配上的事件也不敏感。
    """
    deltas = _align_deltas(events, reader.chunks)
    if len(deltas) >= MIN_ALIGN_SAMPLES:
        return statistics.median(deltas)

    # 退化情况（内容匹配不上）：退回按首个输出字节对齐
    if reader.first_output_at is None:
        return spawned_at
    if events:
        return reader.first_output_at - events[0][0]
    return reader.first_output_at


def _align_deltas(
    events: list[tuple[float, bytes]], chunks: list[tuple[float, bytes]]
) -> list[float]:
    """把 cast 事件在读到的字节流里逐个定位，返回 monotonic 与 cast 时间之差。"""
    if not events or not chunks:
        return []

    stream = b"".join(data for _, data in chunks)
    # 每个 chunk 在 stream 中的结束偏移，用于按字节偏移反查读到的时刻
    ends: list[int] = []
    total = 0
    for _, data in chunks:
        total += len(data)
        ends.append(total)

    deltas: list[float] = []
    search_from = 0
    for at, data in events:
        if len(data) < MIN_ALIGN_BYTES:
            continue
        found = stream.find(data, search_from)
        if found < 0:
            continue
        search_from = found + len(data)
        read_at = chunks[bisect.bisect_right(ends, found)][0]
        deltas.append(read_at - at)
    return deltas


# marker 与它对应的画面之间只隔一次渲染，超过这个间隔就认为没有对应帧
SNAP_WINDOW = 0.6


def snap_markers_to_frames(
    markers: list[tuple[float, str]],
    events: list[tuple[float, bytes]],
    window: float = SNAP_WINDOW,
) -> list[tuple[float, str]]:
    """把 marker 对齐到它之后最近的输出帧上。

    marker 记的是「注入按键的时刻」，画面要等应用响应后的下一帧才变；不对齐的话
    播放器跳到 marker 时显示的还是上一个状态。
    """
    times = [at for at, _ in events]
    snapped = []
    for at, label in markers:
        idx = bisect.bisect_left(times, at)
        if idx < len(times) and times[idx] - at <= window:
            at = times[idx]
        snapped.append((round(at, 3), label))
    return snapped


def write_markers(markers_path: Path, markers: list[tuple[float, str]]) -> None:
    """写出 asciinema-player 的 markers 选项数据。"""
    payload = {"markers": [[at, label] for at, label in markers]}
    markers_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def sanitize_cast_header(cast_path: Path) -> None:
    """去掉 cast 头里 command 的本机绝对解释器路径，避免文档静态资源泄露环境信息。"""
    text = cast_path.read_text(encoding="utf-8")
    if not text:
        return
    first, _, rest = text.partition("\n")
    try:
        header = json.loads(first)
    except ValueError:
        return
    cmd = header.get("command")
    if not isinstance(cmd, str) or " -m vuepy " not in cmd:
        return
    # 只保留「python3 -m vuepy run …」这种可移植形式
    parts = shlex.split(cmd)
    try:
        m_idx = parts.index("-m")
    except ValueError:
        return
    header["command"] = shlex.join(["python3", *parts[m_idx:]])
    cast_path.write_text(
        json.dumps(header, ensure_ascii=False) + "\n" + rest, encoding="utf-8"
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

    sanitize_cast_header(cast_path)
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
