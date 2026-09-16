---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Switch 开关

用于切换布尔状态的开关组件，提供平滑的动画效果，适合用于设置开关、功能启用/禁用等场景。

> 底层：[Textual `Switch`](https://textual.textualize.io/widgets/switch/)

## 基本用法

:::textual-vuepy-demo switch_basic
```vue
<template>
  <VBox>
    <Switch v-model="dark_mode.value" tooltip="暗色模式" />
    <Switch v-model="auto_save.value" tooltip="自动保存" />
    <Label :label="f'暗色模式: {dark_mode.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

dark_mode = ref(False)
auto_save = ref(True)
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `bool` | `False` | 开关当前状态，`True` 为开启，`False` 为关闭 |
| `animate` | `bool` | `True` | 是否显示切换动画效果 |
| `tooltip` | `str` | `""` | 鼠标悬停时显示的提示文字 |

## v-model

`v-model` 默认绑定属性：`value`

```vue
<Switch v-model="feature_enabled.value" />
```

## 事件

| 事件 | 说明 |
|------|------|
| `switch_changed` | 开关状态改变时触发（对应 Textual `Switch.Changed`），事件对象包含 `value` 属性 |

```vue
<Switch
  v-model="notifications.value"
  tooltip="消息通知"
  @switch_changed="on_toggle"
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
