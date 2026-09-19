#!/usr/bin/env bash
# 重新生成 textual-vuepy 文档的示例产物，可在任意目录执行
set -euo pipefail

cd "$(dirname "$0")"

# 静态截图：为所有 .vue 生成同名 .svg
python3 render_textual_vuepy_svgs.py
python3 render_textual_vuepy_svgs.py ../tooltip/tooltip_basic.vue --hover '#sw'

# 交互录屏：为带同名 .play.json 的 .vue 生成 .cast.txt / .cast.json
python3 render_textual_vuepy_asciinema.py
