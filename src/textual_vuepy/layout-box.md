---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# VBox / HBox / Slot 布局容器

VBox、HBox 是 Textual-vuepy 最基础的布局容器，用于将子组件分别沿**垂直方向**或**水平方向**排列。Slot 是 VBox 的别名，通常用作 slot 占位容器。

> 底层：[Textual `Vertical`](https://textual.textualize.io/api/containers/#textual.containers.VerticalScroll) /
> [Textual `Horizontal`](https://textual.textualize.io/api/containers/#textual.containers.HorizontalScroll)

## 基本用法

使用 `VBox` 垂直排列子组件，使用 `HBox` 水平排列子组件，两者可以任意嵌套。

:::textual-vuepy-demo layout_box_basic
```vue
<template>
  <VBox style="height: 1fr; padding: 1;">
    <Label label="顶部标签" />
    <HBox style="height: 3;">
      <Button label="左按钮" />
      <Button label="右按钮" />
    </HBox>
    <Label label="底部标签" />
  </VBox>
</template>
```
:::

## Props

VBox、HBox 和 Slot 本身不定义额外 Props，所有布局控制均通过通用属性（尤其是 `style`）完成。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| *(无特有属性)* | — | — | 通过通用属性 `style` 控制尺寸与布局 |

### 常用 TCSS 布局样式示例

| TCSS 样式 | 说明 |
|-----------|------|
| `height: 1fr` | 占据剩余高度（弹性伸展）|
| `width: 1fr` | 占据剩余宽度（弹性伸展）|
| `height: 5` | 固定高度为 5 行 |
| `padding: 1` | 内边距 1 格 |
| `margin: 1 2` | 垂直外边距 1 格，水平外边距 2 格 |
| `border: solid green` | 实线边框，绿色 |
| `background: $surface` | 使用主题背景色 |
| `align: center middle` | 内容居中对齐 |

## 事件

VBox / HBox / Slot 支持 Textual 标准鼠标与点击事件：

| 事件 | 说明 |
|------|------|
| `@click` | 鼠标点击容器时触发 |
| `@mouse_move` | 鼠标在容器内移动时触发 |
| `@mouse_enter` | 鼠标进入容器区域时触发 |
| `@mouse_leave` | 鼠标离开容器区域时触发 |
| `@scroll_up` | 容器内向上滚动时触发 |
| `@scroll_down` | 容器内向下滚动时触发 |

## 进阶示例

### 等比分割布局

使用 `1fr` 将可用空间等分给多个子容器：

:::textual-vuepy-demo layout_box_equal_split
```vue
<template>
  <HBox style="height: 1fr;">
    <VBox style="width: 1fr; border: solid $accent;">
      <Label label="左侧面板" />
    </VBox>
    <VBox style="width: 2fr; border: solid $primary;">
      <Label label="右侧主内容区（占 2/3）" />
    </VBox>
  </HBox>
</template>
```
:::

### 使用 Slot 占位

`Slot` 与 `VBox` 完全等价，可用于语义化的 slot 占位：

:::textual-vuepy-demo layout_box_slot
```vue
<template>
  <VBox style="height: 1fr;">
    <Slot style="height: 1fr;">
      <Label label="主内容区" />
    </Slot>
  </VBox>
</template>
```
:::

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID，可通过 `#id` 选择器引用 |
| `style` | `str` | TCSS 内联样式，多条规则用分号分隔 |
| `class` | `str` | TCSS 类名，多个类名用空格分隔 |
| `border_title` | `str` | 边框标题（需组件设置了 border 样式才可见）|
| `border_subtitle` | `str` | 边框副标题 |
