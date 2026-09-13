---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Checkbox 复选框

用于布尔值选择的复选框组件，支持选中/未选中两种状态，常用于表单的多项勾选场景。

> 底层：[Textual `Checkbox`](https://textual.textualize.io/widgets/checkbox/)

## 基本用法

```vue
<template>
  <VBox>
    <Checkbox label="记住我" v-model="remember.value" />
    <Checkbox label="同意条款" v-model="agreed.value" />
    <Checkbox label="已禁用" disabled />
    <Label :label="f'同意状态: {agreed.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

remember = ref(False)
agreed = ref(False)
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `str` | `""` | 复选框右侧显示的文字 |
| `value` | `bool` | `False` | 复选框是否选中 |
| `disabled` | `bool` | `False` | 是否禁用复选框（无需传值，存在即为 `True`）|

## v-model

`v-model` 默认绑定属性：`value`

```vue
<Checkbox label="启用通知" v-model="notify_enabled.value" />
```

## 事件

| 事件 | 说明 |
|------|------|
| `checkbox_changed` | 复选框状态改变时触发（对应 Textual `Checkbox.Changed`），事件对象包含 `value` 属性 |

```vue
<Checkbox
  label="开启调试"
  v-model="debug_mode.value"
  @checkbox_changed="on_toggle"
/>
```

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID |
| `style` | `str` | TCSS 内联样式 |
| `class` | `str` | TCSS 类名（空格分隔）|
| `border_title` | `str` | 边框标题 |
| `border_subtitle` | `str` | 边框副标题 |
