#!/usr/bin/env python3
"""遍历目录中的 .vue 文件，用 Textual 后端运行并导出同名 .svg。

示例::

    button_basic.vue  ->  button_basic.svg

用法::

    # 默认遍历脚本所在的 src/textual_vuepy
    python src/textual_vuepy/_scripts/render_textual_vuepy_svgs.py
    python src/textual_vuepy/_scripts/render_textual_vuepy_svgs.py src/textual_vuepy/button
    python src/textual_vuepy/_scripts/render_textual_vuepy_svgs.py --size 100x30
    python src/textual_vuepy/_scripts/render_textual_vuepy_svgs.py --only button_basic
    python src/textual_vuepy/_scripts/render_textual_vuepy_svgs.py --only tooltip_basic --tooltips --hover '#sw'
    python src/textual_vuepy/_scripts/render_textual_vuepy_svgs.py --dry-run
"""

from __future__ import annotations

import argparse
import asyncio
import html as html_lib
import os
import re
import sys
import traceback
from pathlib import Path

DEFAULT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SIZE = (100, 30)
# Textual App.TOOLTIP_DELAY 默认 0.5s，略加余量
DEFAULT_TOOLTIP_SETTLE = 0.6

# Rich export_svg 默认字体宽高比（Fira Code）
_FONT_ASPECT_RATIO = 0.61


def ensure_color_env() -> None:
    """Cursor/CI 常设置 NO_COLOR=1，Textual 会进入 nocolor 灰度模式。"""
    os.environ.pop("NO_COLOR", None)
    os.environ.setdefault("COLORTERM", "truecolor")
    os.environ.setdefault("FORCE_COLOR", "1")
    if os.environ.get("TERM") in (None, "", "dumb"):
        os.environ["TERM"] = "xterm-256color"


def parse_size(value: str) -> tuple[int, int]:
    try:
        w, h = value.lower().split("x", 1)
        return int(w), int(h)
    except Exception as exc:
        raise argparse.ArgumentTypeError(
            f"size must be WIDTHxHEIGHT, e.g. 100x30; got {value!r}"
        ) from exc


def fix_svg_export(svg: str) -> str:
    """修正 Rich SVG：CJK textLength + 中文字体栈。"""
    from rich.cells import cell_len

    m = re.search(r"font-size:\s*([\d.]+)px", svg)
    font_size = float(m.group(1)) if m else 20.0
    char_width = font_size * _FONT_ASPECT_RATIO

    # 优先使用本机 CJK 等宽字体，避免回退比例字体导致重叠
    svg = svg.replace(
        "font-family: Fira Code, monospace;",
        'font-family: "Noto Sans Mono CJK SC", "WenQuanYi Micro Hei Mono", '
        '"Fira Code", monospace;',
    )

    def _fix_text(match: re.Match[str]) -> str:
        attrs, content = match.group(1), match.group(2)
        plain = html_lib.unescape(content.replace("&#160;", "\u00a0"))
        correct_s = f"{char_width * cell_len(plain):.1f}"
        new_attrs = re.sub(r'textLength="[^"]*"', f'textLength="{correct_s}"', attrs)
        return f"<text{new_attrs}>{content}</text>"

    return re.sub(r"<text([^>]*)>(.*?)</text>", _fix_text, svg)


def create_tt_app(vue_path: Path):
    from vuepy import create_app, import_sfc

    Root = import_sfc(vue_path)
    vue_app = create_app(Root, backend="textual")
    vue_app.mount(run=False)
    tt_app = vue_app.tt_app
    # 避免截图标题栏显示类名 TextualDocRootWidget
    tt_app.title = vue_path.stem
    return tt_app


async def render_one(
    vue_path: Path,
    size: tuple[int, int],
    *,
    dry_run: bool,
    tooltips: bool,
    hover: str | None,
    settle: float,
) -> Path:
    out_svg = vue_path.with_suffix(".svg")
    if dry_run:
        return out_svg

    tt_app = create_tt_app(vue_path)
    async with tt_app.run_test(size=size, tooltips=tooltips) as pilot:
        await pilot.pause()
        if getattr(tt_app, "no_color", False):
            raise RuntimeError(
                "Textual 处于 no_color 模式（检测到 NO_COLOR）。"
                "请取消该环境变量后重试。"
            )
        # 可选：用 Pilot 把鼠标移到指定组件（也可配合 .vue 里 onMounted hover）
        if hover:
            await pilot.hover(hover)
        # 等待 layout / onMounted hover / TOOLTIP_DELAY
        if settle > 0:
            await pilot.pause(settle)
        svg = tt_app.export_screenshot(title=vue_path.stem)
    out_svg.write_text(fix_svg_export(svg), encoding="utf-8")
    return out_svg


async def render_all(
    vue_files: list[Path],
    size: tuple[int, int],
    *,
    dry_run: bool,
    continue_on_error: bool,
    tooltips: bool,
    hover: str | None,
    settle: float,
) -> int:
    ok = 0
    failed: list[tuple[Path, str]] = []

    for vue_path in vue_files:
        rel = vue_path.name
        try:
            out = await render_one(
                vue_path,
                size,
                dry_run=dry_run,
                tooltips=tooltips,
                hover=hover,
                settle=settle,
            )
            action = "would write" if dry_run else "wrote"
            size_info = "" if dry_run else f" ({out.stat().st_size} bytes)"
            print(f"  {action}: {out.name}{size_info}")
            ok += 1
        except Exception as exc:
            failed.append((vue_path, str(exc)))
            print(f"  FAIL: {rel}: {exc}", file=sys.stderr)
            if not continue_on_error:
                traceback.print_exc()
                break

    print(f"\nDone: {ok} ok, {len(failed)} failed.")
    if failed:
        print("Failed files:", file=sys.stderr)
        for path, err in failed:
            print(f"  - {path.name}: {err}", file=sys.stderr)
        return 1
    return 0


def collect_vue_files(root: Path, only: str | None) -> list[Path]:
    files = sorted(root.rglob("*.vue"))
    if only:
        files = [p for p in files if only in p.stem or only in p.name]
    return files


def main(argv: list[str] | None = None) -> int:
    ensure_color_env()

    parser = argparse.ArgumentParser(
        description="运行 textual-vuepy 的 .vue 示例并导出同名 .svg",
    )
    parser.add_argument(
        "root",
        nargs="?",
        type=Path,
        default=DEFAULT_ROOT,
        help=f"含 .vue 的目录（默认: {DEFAULT_ROOT})",
    )
    parser.add_argument(
        "--size",
        type=parse_size,
        default=DEFAULT_SIZE,
        help="终端尺寸 WIDTHxHEIGHT（默认: 100x30）",
    )
    parser.add_argument(
        "--only",
        type=str,
        default=None,
        help="只处理文件名包含该子串的 .vue",
    )
    parser.add_argument(
        "--tooltips",
        action="store_true",
        help="启用 Textual tooltip（run_test 默认关闭）；配合 onMounted hover 或 --hover",
    )
    parser.add_argument(
        "--hover",
        type=str,
        default=None,
        metavar="SELECTOR",
        help="截图前用 Pilot hover 到该组件，如 '#sw' / 'Switch'",
    )
    parser.add_argument(
        "--settle",
        type=float,
        default=None,
        metavar="SECONDS",
        help=(
            f"截图前额外等待秒数（默认：启用 tooltips/--hover 时为 "
            f"{DEFAULT_TOOLTIP_SETTLE}，否则为 0）"
        ),
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="只列出将要生成的文件，不实际运行",
    )
    parser.add_argument(
        "--fail-fast",
        action="store_true",
        help="遇到第一个失败即停止（默认继续）",
    )
    args = parser.parse_args(argv)

    root = args.root.resolve()
    if not root.is_dir():
      vue_files = [root]
    else:
      vue_files = collect_vue_files(root, args.only)

    if not vue_files:
        print(f"No .vue files found under {root}", file=sys.stderr)
        return 1

    tooltips = args.tooltips or bool(args.hover)
    if args.settle is not None:
        settle = args.settle
    elif tooltips:
        settle = DEFAULT_TOOLTIP_SETTLE
    else:
        settle = 0.0

    print(f"Found {len(vue_files)} .vue file(s) under {root}")
    print(f"Size: {args.size[0]}x{args.size[1]}")
    if tooltips:
        hover_info = f", hover={args.hover!r}" if args.hover else ""
        print(f"Tooltips: on (settle={settle}s{hover_info})")

    return asyncio.run(
        render_all(
            vue_files,
            args.size,
            dry_run=args.dry_run,
            continue_on_error=not args.fail_fast,
            tooltips=tooltips,
            hover=args.hover,
            settle=settle,
        )
    )


if __name__ == "__main__":
    raise SystemExit(main())
