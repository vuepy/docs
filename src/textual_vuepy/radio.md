---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# RadioButton / RadioSet 单选按钮

`RadioButton` 是单个单选按钮组件；`RadioSet` 是单选按钮组容器，将多个 `RadioButton` 组合在一起并自动实现互斥选择逻辑。

> 底层：[Textual `RadioButton`](https://textual.textualize.io/widgets/radiobutton/) 和 [Textual `RadioSet`](https://textual.textualize.io/widgets/radioset/)

## 基本用法

```vue
<template>
  <VBox>
    <!-- 独立使用 RadioButton -->
    <RadioButton label="选项 A" v-model="opt_a.value" />
    <RadioButton label="选项 B" v-model="opt_b.value" />

    <!-- RadioSet 组合使用（推荐，自动互斥）-->
    <RadioSet v-model="selected.value">
      <RadioButton label="Python" />
      <RadioButton label="TypeScript" />
      <RadioButton label="Rust" />
    </RadioSet>
    <Label :label="f'选中索引: {selected.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

opt_a = ref(False)
opt_b = ref(False)
selected = ref(0)
</script>
```

## RadioButton Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `str` | `""` | 单选按钮右侧显示的文字 |
| `value` | `bool` | `False` | 单选按钮是否选中 |
| `button_inner` | `str` | `"●"` | 选中状态时内部显示的符号（可自定义）|

## RadioSet Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selected_index` | `int` | `0` | 当前选中的 `RadioButton` 索引（从 `0` 开始），`v-model` 绑定此属性 |

## v-model

- `RadioButton` 的 `v-model` 默认绑定属性：`value`
- `RadioSet` 的 `v-model` 默认绑定属性：`selected_index`

```vue
<!-- 单独使用 RadioButton -->
<RadioButton label="同意" v-model="agreed.value" />

<!-- RadioSet 获取选中索引 -->
<RadioSet v-model="lang_index.value">
  <RadioButton label="Python" />
  <RadioButton label="Go" />
</RadioSet>
```

## 事件

| 事件 | 说明 |
|------|------|
| `radio_set_changed` | `RadioSet` 中选中项改变时触发（对应 Textual `RadioSet.Changed`），事件对象包含 `index` 和 `pressed` 属性 |

```vue
<RadioSet v-model="selected.value" @radio_set_changed="on_change">
  <RadioButton label="选项一" />
  <RadioButton label="选项二" />
</RadioSet>
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
