---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Label 文本标签

用于显示静态或动态文本的标签组件，支持 [Rich markup](https://rich.readthedocs.io/en/stable/markup.html) 语法，可渲染带颜色、粗体等样式的终端文本。

> 底层：[Textual `Label`](https://textual.textualize.io/widgets/label/)

## 基本用法

```vue
<template>
  <VBox>
    <Label label="普通文本" />
    <Label label="[bold red]加粗红色[/bold red]" />
    <Label :label="f'计数: {count.value}'" />
    <!-- 使用 content slot -->
    <Label>带内容的标签</Label>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

count = ref(0)
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `str` | `""` | 显示的文本，支持 Rich markup 语法；也可通过默认 slot 内容设置 |

## v-model

`v-model` 默认绑定属性：`label`

```vue
<Label v-model="message.value" />
```

## Slot

`Label` 支持 `default` slot，slot 内容会作为标签的 `label`：

```vue
<Label>[bold green]操作成功[/bold green]</Label>
```

## 事件

`Label` 为纯展示组件，无交互事件。

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID |
| `style` | `str` | TCSS 内联样式 |
| `class` | `str` | TCSS 类名（空格分隔）|
| `border_title` | `str` | 边框标题 |
| `border_subtitle` | `str` | 边框副标题 |
