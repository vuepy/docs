---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Dialog 模态对话框

Dialog 是模态对话框组件，在应用前端弹出覆盖层，阻止背景交互，适合确认操作、展示详情、表单填写等场景。支持 `default` slot（主体内容）和 `footer` slot（底部操作区）。

> 底层：Textual `ModalScreen`（自定义封装）

## 基本用法

:::textual-vuepy-demo dialog_basic
```vue
<template>
  <VBox>
    <Button label="打开对话框" @click="open_dialog()" />
    <Dialog ref="dialog_ref">
      <Label label="这是对话框内容，确认要继续吗？" />
      <template #footer>
        <HBox>
          <Button label="取消" @click="close_dialog()" variant="error" />
          <Button label="确认" @click="confirm()" variant="success" />
        </HBox>
      </template>
    </Dialog>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

dialog_ref = ref(None)

def open_dialog():
    dialog_ref.value.unwrap().open()

def close_dialog():
    dialog_ref.value.unwrap().close()

def confirm():
    print("已确认")
    close_dialog()
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | str | 自动生成 | 对话框唯一 ID，用于区分多个对话框实例 |

## Slots

| Slot | 说明 |
|------|------|
| `default` | 对话框主体内容区域，放置 Label、Input 等任意组件 |
| `footer` | 对话框底部操作区域，通常放置按钮组 |

## v-model

通过 `v-model:value` 控制对话框的显示/隐藏状态（`True` 为打开，`False` 为关闭）。

:::textual-vuepy-demo dialog_vmodel
```vue
<template>
  <VBox>
    <Button label="显示" @click="show_dialog.value = True" />
    <Dialog v-model:value="show_dialog.value">
      <Label label="通过 v-model 控制显隐" />
    </Dialog>
  </VBox>
</template>

<script lang="py">
from vuepy import ref
show_dialog = ref(False)
</script>
```
:::

## 事件

| 事件 | 说明 |
|------|------|
| — | 通过 `ref` 调用 `.open()` / `.close()` 控制，无特殊事件 |

## 通过 ref 调用方法

| 方法 | 说明 |
|------|------|
| `.open()` | 打开（显示）对话框 |
| `.close()` | 关闭（隐藏）对话框 |

## 表单对话框示例

:::textual-vuepy-demo dialog_form
```vue
<template>
  <VBox>
    <Button label="添加用户" @click="open_dialog()" />
    <Dialog ref="form_dialog" name="add-user-dialog">
      <VBox style="height: auto;">
        <Label label="用户名：" />
        <Input v-model="username.value" placeholder="请输入用户名" />
        <Label label="邮箱：" />
        <Input v-model="email.value" placeholder="请输入邮箱" />
      </VBox>
      <template #footer>
        <HBox>
          <Button label="取消" @click="cancel()" />
          <Button label="提交" @click="submit()" variant="primary" />
        </HBox>
      </template>
    </Dialog>
    <Label :label="result.value" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

form_dialog = ref(None)
username    = ref("")
email       = ref("")
result      = ref("")

def open_dialog():
    form_dialog.value.unwrap().open()

def cancel():
    form_dialog.value.unwrap().close()

def submit():
    result.value = f"已提交: {username.value} <{email.value}>"
    form_dialog.value.unwrap().close()
</script>
```
:::

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
