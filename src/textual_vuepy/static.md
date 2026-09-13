---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Static 静态内容显示

用于在终端界面中显示静态或动态文本内容的组件，支持 Rich markup 渲染，适合展示状态信息、说明文字等。

> 底层：[Textual `Static`](https://textual.textualize.io/widgets/static/)

## 基本用法

```vue
<template>
  <VBox>
    <Static content="[bold]粗体文本[/bold]" />
    <Static :content="status_text.value" />
    <!-- 关闭 Rich markup 解析，按原文显示 -->
    <Static content="[非markup内容]" :markup="False" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

status_text = ref("等待中...")
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `content` | `str` | `""` | 要显示的内容，支持 Rich markup 语法；也可通过默认 slot 内容设置 |
| `markup` | `bool` | `True` | 是否解析 Rich markup；设为 `False` 时原样显示内容 |

## v-model

`v-model` 默认绑定属性：`content`

```vue
<Static v-model="info_text.value" />
```

## Slot

`Static` 支持 `default` slot，slot 内容会作为组件的 `content`：

```vue
<Static>[italic]斜体提示文字[/italic]</Static>
```

## 事件

`Static` 为纯展示组件，无交互事件。

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID |
| `style` | `str` | TCSS 内联样式 |
| `class` | `str` | TCSS 类名（空格分隔）|
| `border_title` | `str` | 边框标题 |
| `border_subtitle` | `str` | 边框副标题 |
