---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Button 按钮

用于触发操作的交互式按钮组件，支持多种样式变体与禁用状态。

> 底层：[Textual `Button`](https://textual.textualize.io/widgets/button/)

## 基本用法

```vue
<template>
  <HBox>
    <Button label="默认" @click="on_click()" />
    <Button label="主要" variant="primary" @click="on_click()" />
    <Button label="危险" variant="error" :disabled="is_disabled.value" />
    <Button v-model="btn_label.value" @click="on_click()" />
  </HBox>
</template>

<script lang="py">
from vuepy import ref

is_disabled = ref(False)
btn_label = ref("动态标签")

def on_click():
    print("按钮被点击")
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `str` | `""` | 按钮显示文字；也可通过默认 slot 内容设置 |
| `variant` | `str` | `"default"` | 样式变体：`"default"` \| `"primary"` \| `"success"` \| `"warning"` \| `"error"` |
| `disabled` | `bool` | `False` | 是否禁用按钮（无需传值，存在即为 `True`）|

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
