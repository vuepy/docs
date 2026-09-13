---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Placeholder 占位符

开发阶段用于快速占据布局空间的占位组件，带有醒目的视觉提示。在生产环境中应替换为实际功能组件。

> 底层：[Textual `Placeholder`](https://textual.textualize.io/widgets/placeholder/)

## 基本用法

```vue
<template>
  <VBox style="height: 1fr;">
    <Placeholder label="侧边栏（开发中）" style="width: 20;" />
    <Placeholder label="主内容区" style="height: 1fr;" />
  </VBox>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `str` | `""` | 占位符提示文字（可选），显示在占位区域内部 |

## 事件

`Placeholder` 为纯展示组件，无交互事件。

## 说明

- `Placeholder` 会自动循环显示不同的视觉变体（随机颜色、尺寸信息等）
- 每次按下 `p` 键可切换显示变体
- 适合在布局搭建阶段快速验证界面结构，无需提前实现真实组件

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID |
| `style` | `str` | TCSS 内联样式 |
| `class` | `str` | TCSS 类名（空格分隔）|
| `border_title` | `str` | 边框标题 |
| `border_subtitle` | `str` | 边框副标题 |
