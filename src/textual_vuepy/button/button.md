---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Button 按钮

用于触发操作的交互式按钮组件，支持多种样式变体、扁平样式与禁用状态。

> 底层：[Textual `Button`](https://textual.textualize.io/widgets/button/)

## 基本用法

下面依次展示标准按钮、禁用按钮、扁平（`flat`）按钮与禁用的扁平按钮：

:::textual-vuepy-demo button_basic
```vue
<template>
  <HBox style="height: 1fr;">
    <VBox>
      <Label label="Standard Buttons" />
      <Button label="Default" />
      <Button label="Primary!" variant="primary" />
      <Button label="Success!" variant="success" />
      <Button label="Warning!" variant="warning" />
      <Button label="Error!" variant="error" />
    </VBox>
    <VBox>
      <Label label="Disabled Buttons" />
      <Button label="Default" disabled />
      <Button label="Primary!" variant="primary" disabled />
      <Button label="Success!" variant="success" disabled />
      <Button label="Warning!" variant="warning" disabled />
      <Button label="Error!" variant="error" disabled />
    </VBox>
    <VBox>
      <Label label="Flat Buttons" />
      <Button label="Default" flat />
      <Button label="Primary!" variant="primary" flat />
      <Button label="Success!" variant="success" flat />
      <Button label="Warning!" variant="warning" flat />
      <Button label="Error!" variant="error" flat />
    </VBox>
    <VBox>
      <Label label="Disabled Flat Buttons" />
      <Button label="Default" disabled flat />
      <Button label="Primary!" variant="primary" disabled flat />
      <Button label="Success!" variant="success" disabled flat />
      <Button label="Warning!" variant="warning" disabled flat />
      <Button label="Error!" variant="error" disabled flat />
    </VBox>
  </HBox>
</template>
```
:::

## 事件与动态标签

`@click` 监听点击，`:label` 动态绑定按钮文字：


:::textual-vuepy-demo button_event
```vue
<template>
  <HBox>
    <Button :label="btn_label.value" @click="on_click()" />
  </HBox>
</template>

<script lang="py">
from vuepy import ref

btn_label = ref("dynamic label")

def on_click():
    btn_label.value = "button clicked"
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `str` | `""` | 按钮显示文字；也可通过默认 slot 内容设置 |
| `variant` | `str` | `"default"` | 样式变体：`"default"` \| `"primary"` \| `"success"` \| `"warning"` \| `"error"` |
| `disabled` | `bool` | `False` | 是否禁用按钮（无需传值，存在即为 `True`）|
| `flat` | `bool` | `False` | 是否使用扁平样式，去掉按钮的立体边框（无需传值，存在即为 `True`）|
| `compact` | `bool` | `False` | 是否使用紧凑样式（无需传值，存在即为 `True`）|

## v-model

`v-model` 默认绑定属性：`label`

```vue
<Button v-model="btn_label.value" />
```

## Slot

`Button` 支持 `default` slot，slot 内容会作为按钮的 `label`：

```vue
<Button @click="on_click()">确认提交</Button>
```

## 事件

| 事件 | 说明 |
|------|------|
| `click` | 按钮被点击时触发（对应 Textual `Button.Pressed`）|

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID |
| `style` | `str` | TCSS 内联样式 |
| `class` | `str` | TCSS 类名（空格分隔）|
| `border_title` | `str` | 边框标题 |
| `border_subtitle` | `str` | 边框副标题 |
