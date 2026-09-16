#!/usr/bin/env python3
"""从 Markdown 中提取 :::textual-vuepy-demo 示例，保存为同级 .vue 文件。

示例::

    :::textual-vuepy-demo button_basic
    ```vue
    <template>...</template>
    ```
    :::

会写入与该 .md 同目录的 ``button_basic.vue``。

用法::

    python scripts/extract_textual_vuepy_demos.py
    python scripts/extract_textual_vuepy_demos.py src/textual_vuepy
    python scripts/extract_textual_vuepy_demos.py --dry-run
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

DEMO_RE = re.compile(
    r"^:::textual-vuepy-demo\s+(\S+)\s*\n"  # 容器名
    r"```vue\s*\n"  # vue 代码围栏
    r"(.*?)"  # vue 源码
    r"^```\s*\n"  # 结束围栏
    r"^:::\s*$",  # 容器结束
    re.MULTILINE | re.DOTALL,
)

DEFAULT_ROOT = Path(__file__).resolve().parent.parent / "src"


def extract_demos(md_path: Path) -> list[tuple[str, str]]:
    """返回 [(demo_name, vue_source), ...]。"""
    text = md_path.read_text(encoding="utf-8")
    return [(m.group(1), m.group(2)) for m in DEMO_RE.finditer(text)]


def write_vue(md_path: Path, name: str, source: str, *, dry_run: bool) -> Path:
    out = md_path.with_name(f"{name}.vue")
    # 保持源码末尾恰好一个换行
    content = source.rstrip("\n") + "\n"
    if not dry_run:
        out.write_text(content, encoding="utf-8")
    return out


def process_dir(root: Path, *, dry_run: bool) -> int:
    md_files = sorted(root.rglob("*.md"))
    written = 0
    conflicts: list[str] = []

    for md_path in md_files:
        demos = extract_demos(md_path)
        if not demos:
            continue

        print(f"{md_path}: {len(demos)} demo(s)")
        seen_in_file: dict[str, Path] = {}
        for name, source in demos:
            out = write_vue(md_path, name, source, dry_run=dry_run)
            if name in seen_in_file:
                conflicts.append(
                    f"duplicate demo name '{name}' in {md_path}"
                )
            seen_in_file[name] = out
            try:
                rel = out.relative_to(root)
            except ValueError:
                rel = out
            action = "would write" if dry_run else "wrote"
            print(f"  {action}: {rel}")
            written += 1

    if conflicts:
        print("\nConflicts:", file=sys.stderr)
        for c in conflicts:
            print(f"  - {c}", file=sys.stderr)
        return 1

    print(f"\nDone: {written} .vue file(s) {'planned' if dry_run else 'written'}.")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="提取 :::textual-vuepy-demo 中的 Vue 代码到同级 .vue 文件",
    )
    parser.add_argument(
        "root",
        nargs="?",
        type=Path,
        default=DEFAULT_ROOT,
        help=f"要扫描的目录（默认: {DEFAULT_ROOT})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="只打印将要写入的文件，不实际写入",
    )
    args = parser.parse_args(argv)

    root = args.root.resolve()
    if not root.is_dir():
        print(f"Not a directory: {root}", file=sys.stderr)
        return 1

    return process_dir(root, dry_run=args.dry_run)


if __name__ == "__main__":
    # raise SystemExit(main())
    print()
