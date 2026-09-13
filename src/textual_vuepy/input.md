---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Input 单行输入框

用于接收用户单行文本输入的表单组件，支持多种输入类型、密码模式、输入验证等功能。

> 底层：[Textual `Input`](https://textual.textualize.io/widgets/input/)

## 基本用法

```vue
<template>
  <VBox>
    <Input v-model="username.value" placeholder="请输入用户名" />
    <Input v-model="password.value" placeholder="请输入密码" password />
    <Input v-model="age.value" type="integer" placeholder="年龄" />
    <Button label="提交" @click="submit()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

username = ref("")
password = ref("")
age = ref("")

def submit():
    print(f"用户名: {username.value}, 年龄: {age.value}")
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `str` | `""` | 输入框当前值 |
| `placeholder` | `str` | `""` | 无内容时显示的占位提示文字 |
| `password` | `bool` | `False` | 密码模式，输入内容显示为 `*`（无需传值，存在即为 `True`）|
| `disabled` | `bool` | `False` | 是否禁用输入框（无需传值，存在即为 `True`）|
| `compact` | `bool` | `False` | 紧凑模式，减少内边距（无需传值，存在即为 `True`）|
| `type` | `str` | `"text"` | 输入类型：`"text"` \| `"integer"` \| `"number"` \| `"url"` \| `"email"` \| `"telephone"` |
| `max_length` | `int` | `0` | 最大输入字符数，`0` 表示不限制 |

## v-model

`v-model` 默认绑定属性：`value`

```vue
<Input v-model="username.value" placeholder="用户名" />
```

## 事件

| 事件 | 说明 |
|------|------|
| `input_changed` | 输入内容改变时触发（对应 Textual `Input.Changed`），事件对象包含 `value` 属性 |
| `input_submitted` | 用户按下 `Enter` 提交时触发（对应 Textual `Input.Submitted`），事件对象包含 `value` 属性 |

```vue
<Input
  v-model="query.value"
  placeholder="搜索..."
  @input_changed="on_change"
  @input_submitted="on_submit"
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
