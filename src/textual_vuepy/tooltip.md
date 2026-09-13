---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Tooltip 工具提示

Tooltip 在鼠标悬停或聚焦组件时显示提示文字。在 Textual-vuepy 中，最常见的用法是通过其他组件的 `tooltip` 属性直接设置，也可以作为独立的 `<Tooltip>` 组件使用。

> 底层：[Textual Tooltips](https://textual.textualize.io/guide/widgets/#tooltips)

## 基本用法

```vue
<template>
  <VBox>
    <!-- 通过 tooltip 属性设置（推荐）-->
    <Button label="悬停查看提示" tooltip="这是一个提示信息" />
    <Switch v-model="flag.value" tooltip="开启/关闭某功能" />

    <!-- 作为独立组件 -->
    <Tooltip message="独立 Tooltip 组件" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
flag = ref(False)
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `message` | str | `""` | 提示文字内容（用于独立 `<Tooltip>` 组件）|

> **推荐方式**：为任意组件添加 `tooltip="提示文字"` 属性，无需单独使用 `<Tooltip>` 组件。

## v-model

`v-model` 默认绑定属性：`text`

## 事件

| 事件 | 说明 |
|------|------|
| — | Tooltip 为展示组件，无特殊事件 |

## 为各类组件添加 Tooltip

所有 Textual-vuepy 组件都支持通过 `tooltip` 属性添加悬停提示：

```vue
<template>
  <VBox style="padding: 2 4;">
    <Label label="表单示例" style="text-style: bold;" />

    <Label label="用户名：" tooltip="请输入 3-20 位字母数字" />
    <Input placeholder="用户名" tooltip="3-20 位字母数字，首字符必须为字母" />

    <Label label="通知：" />
    <Switch
      v-model="notify.value"
      tooltip="开启后将通过邮件接收系统通知"
    />

    <Button
      label="提交"
      variant="primary"
      tooltip="点击提交表单，提交后不可撤回"
      @click="submit()"
    />

    <Button
      label="重置"
      tooltip="清空所有输入内容"
      @click="reset()"
    />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

notify = ref(True)

def submit():
    pass

def reset():
    notify.value = True
</script>
```

## 动态 Tooltip 示例

```vue
<template>
  <VBox>
    <Button
      label="操作按钮"
      :tooltip="btn_tip.value"
      :disabled="is_busy.value"
      @click="do_action()"
    />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

is_busy = ref(False)
btn_tip = ref("点击执行操作")

def do_action():
    is_busy.value = True
    btn_tip.value = "操作执行中，请稍候..."
    def done():
        is_busy.value = False
        btn_tip.value = "操作已完成，可再次点击"
    app.tt_app.set_timer(2, done)
</script>
```

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
