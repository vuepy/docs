# Vuepy.org 中文文档

## 如何参与贡献

有劳访问 [wiki](https://github.com/vuejs-translations/docs-zh-cn/wiki) 了解相关注意事项。

目前网站处于维护状态，欢迎大家：

- 修复错别字或错误的书写格式
- 发 issue 讨论译法或书写格式
- 发 issue 讨论部署或协作流程上的问题

## 如何在本地编辑和预览该网站

本项目要求：

- Node.js 为 `v14.0.0` 或更高版本
- pnpm 为 `v7.4.0` 或更高版本

本站基于 [VitePress](https://github.com/vuejs/vitepress) 和 [@vue/theme](https://github.com/vuejs/vue-theme) 建立。网站内容以 Markdown 格式书写，位于 `src` 文件夹中。

```sh
pnpm i
pnpm run dev
```


## 贡献者列表

本站从 [vuejs-translations/docs-zh-cn](https://github.com/vuejs-translations/docs-zh-cn) fork而来，因此保留原仓库的贡献者列表。

最新的文档/翻译贡献情况可以参阅 GitHub 提供的 [contributors](https://github.com/vuejs-translations/docs-zh-cn/graphs/contributors) 页面。

以下是基于该仓库中 PR 和 commit 统计并按总数量排序的所有贡献者，[生成逻辑可在此查阅](https://github.com/ShenQingchuan/github-contributor-svg-generator)。

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ShenQingchuan/github-contributor-svg-generator@main/.github-contributors/vuejs-translations_docs-zh-cn.svg">
    <img src="https://cdn.jsdelivr.net/gh/ShenQingchuan/github-contributor-svg-generator@main/.github-contributors/vuejs-translations_docs-zh-cn.svg" />
  </a>
</p>

## 版权声明

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议  (CC BY-NC-SA 4.0) </a>进行许可。

## ipynb 文档转换方案

实现了将ipynb文件转换为md文件，并保留ipynb中已渲染的小组件.

外层md使用 `ipywui-demo` 容器，里面包含一个ipynb文件。

```md
:::ipywui-demo test
src/examples/ipywui/component/accordion
:::
```

之后会使用 [`ipynb-markdown-transform`](./.vitepress/plugins/ipynb-markdown-transform.ts) 插件将ipynb文件转换为md文件，并替换到 `ipywui-demo` 容器中。
大致的流程为:

读取 `src/examples/ipywui/component/accordion.ipynb` 文件, 本质是json文件,结构为:
```json
{
    "cells": [
        {
            "cell_type": "markdown" | "code" | "raw",
            "source": ["# 标题"],
            "metadata": {}
        }
    ]
}
```
* 当cell_type为markdown时,渲染为markdown文件
* 当cell_type为code时,渲染为代码文件,使用‵<IpywuiDemo></IpywuiDemo>‵容器包裹,并使用‵<template #src>‵和‵<template #output>‵包裹代码和输出(对应代码渲染好的组件)。
* 当cell_type为raw时,渲染为原始文件。

## textual 文档转换方案

textual-vuepy 的示例是跑在终端里的 Textual 应用，没法像 ipynb 那样把渲染结果存进文档。
这里的做法是：Markdown 里只写一个容器名，示例源码与运行效果都放在 md 的同级目录，
由 [`textual-vuepy-demo`](./.vitepress/plugins/textual-vuepy-demo.ts) 插件在构建时拼装。

```md
:::textual-vuepy-demo overview_vueuse
:::
```

一个组件一个目录，示例的所有文件同名不同后缀：

```
src/textual_vuepy/overview/
├── overview.md                  # 文档，用 :::textual-vuepy-demo 引用示例
├── overview_vueuse.vue          # 示例源码（唯一需要手写的）
├── overview_vueuse.svg          # 静态截图
├── overview_vueuse.play.json    # 交互脚本，可选
├── overview_vueuse.cast.txt     # asciinema 录屏，由 .play.json 生成
└── overview_vueuse.cast.json    # 播放器章节标记 markers，由 .play.json 生成
```

插件的处理流程：

* 读同目录的 `<name>.vue` 渲染成代码块，放进 `<IpywuiDemo>` 的 `#src`；
* 运行效果优先用 `<name>.cast.txt`，渲染为 `<AsciinemaPlayer>`，可回放交互过程。
  终端尺寸取自 asciicast 头部的 `width`/`height`，章节标记取自 `<name>.cast.json`；
* 没有录屏时回退到 `<name>.svg`，直接内联进页面。svg 会被当作 Vue 模板编译，
  所以 `<style>`/`<script>` 会改写成动态组件、`{{` 会转义；
* 两者都没有时只渲染源码并告警；
* 读到的文件都登记为 md 的依赖，开发时改动示例会触发热更新。

`.cast.txt` 这个后缀是为了体积：录屏里大量重复的 SGR 序列 gzip 后能小 30 倍，而 CDN
（GitHub Pages）按 content-type 决定是否压缩，未知的 `.cast` 会落到
`application/octet-stream` 拿不到压缩。播放器按文件内容里的 `header.version` 选解析器，
与扩展名无关。插件会把它复制一份到 `src/public/casts/`（已在 `.gitignore` 中）供静态访问。

### 生成示例产物

脚本都在 [`src/textual_vuepy/_scripts`](./src/textual_vuepy/_scripts)，不带参数时遍历整个
`src/textual_vuepy`，也可以只处理某个目录或用 `--only <示例名>` 过滤。运行需要 Python 3.10
环境；录屏还需要系统装有 `asciinema`。

```sh
# 全部重新生成
bash src/textual_vuepy/_scripts/render_textual_vuepy.sh

# 静态截图：headless 运行 .vue，导出同名 .svg
python src/textual_vuepy/_scripts/render_textual_vuepy_svgs.py --only button_basic

# 交互录屏：为带同名 .play.json 的 .vue 生成 .cast.txt / .cast.json
python src/textual_vuepy/_scripts/render_textual_vuepy_asciinema.py --only overview_vueuse
```

目录里还有个 `extract_textual_vuepy_demos.py`，是把示例从 md 代码块搬进独立 `.vue` 的一次性迁移
脚本。示例源码现在以 `.vue` 为准，md 里保留的代码块只是节选，重跑会把 `.vue` 覆盖成残缺版本，
因此它的入口默认是停用的。

截图脚本用 Textual 的 headless `run_test` 跑示例，再经 Rich 的 `export_svg` 导出，额外修正了
CJK 字符的 `textLength` 和中文字体栈，并清掉 `NO_COLOR`（Cursor/CI 常设，会让 Textual 变灰度）。

### 交互录屏的 .play.json

只有动态效果（动画、状态变化、对话框、输入）值得录屏，静态组件用截图即可，
因此只给需要的示例写 `.play.json`：

```json
{
  "size": "100x30",
  "probe_settle": 0.4,
  "targets": {
    "input": {"query": "Input", "anchor": "topleft", "dx": 2, "dy": 1},
    "corner": {"xy": [80, 20]}
  },
  "steps": [
    {"wait": 1.5, "marker": "启动应用"},
    {"click": "input"},
    {"type": "hello"},
    {"key": "enter", "delay": 0.5},
    {"key": "ctrl+q", "marker": "退出"}
  ]
}
```

`targets` 用 `query`/`nth` 选中控件，再由 `anchor`（`center`、`topleft` 等）加 `dx`/`dy`
定位到具体单元格；纯坐标场景可以直接写 `xy`。`steps` 支持 `wait`、`click`、`move`、`type`、
`key`、`send`，每步都能带 `delay` 和 `marker`，`marker` 会写进 `.cast.json` 成为播放器的章节标记。

录制时脚本自己开一个 pty 跑 asciinema（asciinema 只在 stdin/stdout 是真实 tty 时才转发按键），
再把按键和 SGR 鼠标序列写进 pty master。点击坐标不是写死的：脚本会用 headless `run_test`
以相同尺寸把步骤重放一遍，在每次交互前实时解析目标控件的位置，因此示例布局调整后坐标依然有效。

两个容易踩的坑：被 Textual 占用的按键（`ctrl+c` 只会弹出退出提示、`ctrl+q` 直接退出、
`ctrl+p` 打开命令面板）不要用来驱动示例逻辑；应用若始终不退出，录制会一直等到 `--timeout`
（默认 120 秒）才被强制结束，调试时可以配合 `--timeout` 和 `--mirror`（回显录制过程）。

