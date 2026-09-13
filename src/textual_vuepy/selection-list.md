---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# SelectionList / Selection 多选列表

`SelectionList` 是支持多选的列表组件，`Selection` 是其子选项组件。用户可以通过空格键切换每项的选中状态，适用于多项选择的表单场景。

> 底层：[Textual `SelectionList`](https://textual.textualize.io/widgets/selection_list/)

## 基本用法

```vue
<template>
  <VBox>
    <SelectionList ref="list_ref" @selection_list_selected_changed="on_change">
      <Selection prompt="Python" value="py" />
      <Selection prompt="JavaScript" value="js" :initial_state="True" />
      <Selection prompt="Rust" value="rs" />
    </SelectionList>
    <Label :label="f'已选: {selected_str.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

list_ref = ref(None)
selected_str = ref("")

def on_change(event):
    if list_ref.value:
        selected_str.value = str(list_ref.value.unwrap().selected)
</script>
```

## SelectionList Props

`SelectionList` 无特殊 Props，通过子 `Selection` 组件声明选项。

## Selection Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `prompt` | `str` | — | **必填**，选项显示文字 |
| `value` | `any` | 与 `prompt` 相同 | 选项的绑定值，选中后通过 `.selected` 返回此值 |
| `initial_state` | `bool` | `False` | 初始是否处于选中状态 |

## v-model

- `SelectionList` 无 `v-model`，通过 `ref` 访问 `.selected` 获取选中值列表
- `Selection` 的 `v-model` 默认绑定属性：`prompt`

## 事件

| 事件 | 说明 |
|------|------|
| `selection_list_selected_changed` | 选中项列表发生变化时触发（对应 Textual `SelectionList.SelectedChanged`）|

## 通过 ref 访问

通过 `ref` 获取 `SelectionList` 实例后，可访问：

| 属性 / 方法 | 说明 |
|------------|------|
| `.selected` | 当前所有选中项的 `value` 列表 |
| `.clear_selections()` | 清除所有选中状态 |
| `.select_all()` | 选中所有选项 |

```vue
<template>
  <VBox>
    <SelectionList ref="lang_list">
      <Selection prompt="Go" value="go" />
      <Selection prompt="Python" value="py" :initial_state="True" />
      <Selection prompt="Java" value="java" />
    </SelectionList>
    <HBox>
      <Button label="全选" @click="select_all()" />
      <Button label="清空" @click="clear_all()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

lang_list = ref(None)

def select_all():
    if lang_list.value:
        lang_list.value.unwrap().select_all()

def clear_all():
    if lang_list.value:
        lang_list.value.unwrap().clear_selections()
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
