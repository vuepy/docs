---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# DataTable 数据表格

DataTable 是功能强大的表格组件，支持键盘导航、光标选择、斑马纹等特性，适合展示结构化数据。

> 底层：[Textual `DataTable`](https://textual.textualize.io/widgets/data_table/)

## 基本用法

:::textual-vuepy-demo data_table_basic
```vue
<template>
  <DataTable
    :cols="['姓名', '年龄', '城市']"
    :rows="users"
    zebra_stripes
    style="height: 1fr;"
  />
</template>

<script lang="py">
users = [
    ("张三", "28", "北京"),
    ("李四", "35", "上海"),
    ("王五", "22", "广州"),
]
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `cols` | list[str] | `[]` | 列名列表，如 `["名称", "年龄", "城市"]` |
| `rows` | list[tuple \| list] | `[]` | 行数据列表，每行是一个 tuple 或 list |
| `show_header` | bool | `True` | 是否显示表头 |
| `show_cursor` | bool | `True` | 是否显示光标 |
| `zebra_stripes` | bool | `False` | 是否启用斑马条纹 |
| `cursor_type` | str | `"row"` | 光标类型：`"cell"` \| `"row"` \| `"column"` \| `"none"` |

## 响应式 `cols` / `rows`

`:cols` 与 `:rows` 支持响应式更新：当绑定的 list 被整体替换时，组件会内部执行 `clear(columns=True)` 再重新 `add_columns` / `add_rows`，**不会**覆盖 Textual 内部的 `rows` 字典。

适合「请求完成后刷新整表」的场景：

:::textual-vuepy-demo data_table_reactive_rows
```vue
<template>
  <VBox style="height: 1fr;">
    <DataTable
      :cols="['ID', '名称', '状态']"
      :rows="data_rows.value"
      zebra_stripes
      style="height: 1fr;"
    />
    <Button label="刷新数据" @click="reload()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

data_rows = ref([
    ("001", "任务 A", "完成"),
    ("002", "任务 B", "进行中"),
    ("003", "任务 C", "待开始"),
])

def reload():
    data_rows.value = [
        ("001", "任务 A", "完成"),
        ("002", "任务 B", "完成"),
        ("003", "任务 C", "进行中"),
        ("004", "任务 D", "待开始"),
    ]
</script>
```
:::

::: tip
请使用**整体赋值**更新数据（`data_rows.value = [...]`）。若只需追加一行且不想重建表格，可用下方 `ref` 调用 `.add_row()`。
:::

## v-model

`v-model` 默认绑定属性：`data`

更推荐使用 `:rows` / `:cols` 分别绑定（见上一节）；动态刷新整表时优先用响应式 `:rows`。

## 事件

| 事件 | 说明 |
|------|------|
| `@data_table_row_selected` | 行被选中时触发（`DataTable.RowSelected`），`event.row_key` 包含行键 |
| `@data_table_cell_selected` | 单元格被选中时触发（`DataTable.CellSelected`），`event.coordinate` 包含坐标 |

## 通过 ref 调用方法

通过 `ref` 获取底层 Textual Widget 实例后，可调用以下方法：

| 方法 | 说明 |
|------|------|
| `.add_row(*cells)` | 追加一行数据 |
| `.add_column(label)` | 追加一列 |
| `.clear()` | 清空所有数据 |
| `.move_cursor(row=n)` | 移动光标到指定行 |

:::textual-vuepy-demo data_table_ref_methods
```vue
<template>
  <VBox style="height: 1fr;">
    <DataTable ref="dt_ref" :cols="['商品', '价格']" :rows="items" style="height: 1fr;" />
    <Button label="追加行" @click="add_row()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

dt_ref = ref(None)
items = [("苹果", "5.00"), ("香蕉", "3.00")]

def add_row():
    dt_ref.value.unwrap().add_row("橙子", "4.50")
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
