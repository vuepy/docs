---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Select 下拉选择框

提供下拉列表供用户从多个选项中选择一项的表单组件，支持空选择和自定义提示文字。

> 底层：[Textual `Select`](https://textual.textualize.io/widgets/select/)

## 基本用法

```vue
<template>
  <VBox>
    <Select
      v-model="language.value"
      :options="[('Python', 'py'), ('JavaScript', 'js'), ('Rust', 'rs')]"
      prompt="选择语言"
    />
    <Label :label="f'已选: {language.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

language = ref("py")
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `options` | `list` | `[]` | 选项列表，格式为 `[(显示文字, 值), ...]` |
| `value` | `any` | `None` | 当前选中的值 |
| `prompt` | `str` | `"Select"` | 未选中任何项时显示的提示文字 |
| `allow_blank` | `bool` | `True` | 是否允许空选择（显示 `prompt` 状态）|

## v-model

`v-model` 默认绑定属性：`value`

```vue
<Select v-model="theme.value" :options="theme_options" prompt="选择主题" />
```

## 事件

| 事件 | 说明 |
|------|------|
| `select_changed` | 选中项改变时触发（对应 Textual `Select.Changed`），事件对象包含 `value` 属性 |

```vue
<Select
  v-model="color.value"
  :options="color_options"
  @select_changed="on_select"
/>
```

## 更多示例

```vue
<template>
  <VBox>
    <!-- 动态选项列表 -->
    <Select
      v-model="selected_city.value"
      :options="city_options.value"
      prompt="选择城市"
      :allow_blank="False"
    />
    <Label :label="f'城市代码: {selected_city.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

city_options = ref([
    ("北京", "BJ"),
    ("上海", "SH"),
    ("广州", "GZ"),
    ("深圳", "SZ"),
])
selected_city = ref("BJ")
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
