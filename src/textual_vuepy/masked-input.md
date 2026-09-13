---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# MaskedInput 格式化掩码输入框

基于掩码模板的格式化输入框，强制用户按照指定格式输入内容，适用于日期、电话号码、身份证等固定格式的数据录入场景。

> 底层：[Textual `MaskedInput`](https://textual.textualize.io/widgets/masked_input/)

## 基本用法

```vue
<template>
  <VBox>
    <Label label="日期输入（YYYY-MM-DD）：" />
    <MaskedInput template="9999-99-99;" v-model="date.value" />
    <Label label="电话（手机）：" />
    <MaskedInput template="999-9999-9999;" v-model="phone.value" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

date = ref("")
phone = ref("")
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `template` | `str` | — | **必填**，掩码模板字符串，定义输入格式（见下方掩码字符说明）|
| `value` | `str` | `""` | 输入框当前值 |

## v-model

`v-model` 默认绑定属性：`value`

```vue
<MaskedInput template="9999-99-99;" v-model="date.value" />
```

## 掩码字符说明

| 字符 | 说明 |
|------|------|
| `A` | 字母（a-z, A-Z，必填）|
| `a` | 字母（a-z, A-Z，可选）|
| `N` | 字母或数字（必填）|
| `n` | 字母或数字（可选）|
| `#` 或 `9` | 数字（0-9，必填）|
| `X` | 任意字符（必填）|
| `;` | 模板结束符（可选，用于分隔掩码和占位符）|

## 事件

| 事件 | 说明 |
|------|------|
| `input_changed` | 输入内容改变时触发（对应 Textual `Input.Changed`）|
| `input_submitted` | 用户按下 `Enter` 提交时触发（对应 Textual `Input.Submitted`）|

## 更多示例

```vue
<template>
  <VBox>
    <!-- 身份证号 -->
    <Label label="身份证号：" />
    <MaskedInput template="999999-9999-9999-9999;" v-model="id_card.value" />

    <!-- IP 地址 -->
    <Label label="IP 地址：" />
    <MaskedInput template="990.990.990.990;" v-model="ip.value" />

    <Button label="确认" @click="confirm()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

id_card = ref("")
ip = ref("")

def confirm():
    print(f"身份证: {id_card.value}, IP: {ip.value}")
</script>
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
