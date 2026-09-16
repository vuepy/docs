---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Rule 分隔线

在布局中插入水平或垂直分隔线的组件，支持多种线条样式，用于在视觉上分隔不同内容区域。

> 底层：[Textual `Rule`](https://textual.textualize.io/widgets/rule/)

## 基本用法

:::textual-vuepy-demo rule_basic
```vue
<template>
  <VBox>
    <Label label="上方内容" />
    <Rule />
    <Label label="下方内容" />
    <Rule line_style="dashed" />
    <Label label="虚线下方" />
    <Rule line_style="double" />
    <Label label="双线下方" />
  </VBox>
</template>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `line_style` | `str` | `"solid"` | 线条样式：`"ascii"` \| `"blank"` \| `"dashed"` \| `"double"` \| `"heavy"` \| `"hidden"` \| `"none"` \| `"solid"` |
| `orientation` | `str` | `"horizontal"` | 分隔线方向：`"horizontal"`（水平）\| `"vertical"`（垂直）|

## 事件

`Rule` 为纯展示组件，无交互事件。

## 说明

- 水平分隔线（`orientation="horizontal"`）会自动占满容器宽度，高度为 1 行
- 垂直分隔线（`orientation="vertical"`）会自动占满容器高度，宽度为 1 列
- 在 `HBox` 中使用时，推荐设置 `orientation="vertical"` 作为列分隔符

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID |
| `style` | `str` | TCSS 内联样式 |
| `class` | `str` | TCSS 类名（空格分隔）|
| `border_title` | `str` | 边框标题 |
| `border_subtitle` | `str` | 边框副标题 |
