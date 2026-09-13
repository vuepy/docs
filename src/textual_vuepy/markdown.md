---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Markdown / MarkdownViewer Markdown 渲染

`Markdown` 组件将 Markdown 文本渲染为富文本终端内容；`MarkdownViewer` 在此基础上增加了可折叠的目录侧边栏，适合展示较长文档。两者均支持 content slot 直接内联写入 Markdown 文本。

> 底层：[Textual `Markdown`](https://textual.textualize.io/widgets/markdown/) · [Textual `MarkdownViewer`](https://textual.textualize.io/widgets/markdown_viewer/)

## 基本用法

```vue
<template>
  <VBox style="height: 1fr;">
    <!-- 基础 Markdown 渲染 -->
    <Markdown :markdown="md_content" style="height: 1fr;" />

    <!-- Markdown 查看器（含目录）-->
    <MarkdownViewer :markdown="md_content" style="height: 1fr;" />

    <!-- 使用 content slot -->
    <Markdown>
## 标题
这是 **Markdown** 内容。
    </Markdown>
  </VBox>
</template>

<script lang="py">
md_content = """
# Vue.py

Vue.py 是基于 Python 的响应式框架。

## 特性
- 响应式数据
- 组件化开发
- 支持多后端
"""
</script>
```

## Props

### Markdown

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `markdown` | str | `""` | 要渲染的 Markdown 文本内容 |

### MarkdownViewer

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `markdown` | str | `""` | 要渲染的 Markdown 文本内容 |
| `show_table_of_contents` | bool | `True` | 是否在左侧显示目录（TOC）面板 |

## v-model

- `Markdown`：`v-model` 默认绑定属性 `markdown`，可动态更新渲染内容
- `MarkdownViewer`：`v-model` 默认绑定属性 `markdown`

```vue
<template>
  <VBox style="height: 1fr;">
    <Markdown v-model="content.value" style="height: 1fr;" />
    <Button label="切换内容" @click="toggle()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

content = ref("# 默认内容\n\n这是初始 Markdown。")

page_a = "# 页面 A\n\n这是第一个页面的内容。"
page_b = "# 页面 B\n\n这是第二个页面，有更多 **细节**。"

def toggle():
    content.value = page_b if content.value == page_a else page_a
</script>
```

## Content Slot

除了通过 `markdown` prop 传入内容，也可以直接在组件标签内部书写 Markdown 文本（content slot）：

```vue
<template>
  <Markdown style="height: 1fr;">
# 内联 Markdown

直接在模板中书写，**无需** Python 变量。

## 列表示例
- 条目一
- 条目二
- 条目三
  </Markdown>
</template>
```

## 事件

| 事件 | 说明 |
|------|------|
| `@markdown_link_clicked` | 点击 Markdown 内链接时触发（`Markdown.LinkClicked`），`event.href` 为链接地址 |

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
