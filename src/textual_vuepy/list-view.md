---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# ListView / ListItem 可滚动列表视图

`ListView` 是可键盘导航的滚动列表容器，每个列表项用 `ListItem` 包裹，`ListItem` 内部可放置 `Label`、`Static` 等子组件。

> 底层：[Textual `ListView`](https://textual.textualize.io/widgets/list_view/)

## 基本用法

```vue
<template>
  <ListView @list_view_selected="on_select" style="height: 1fr;">
    <ListItem><Label label="🐍 Python" /></ListItem>
    <ListItem><Label label="📝 TypeScript" /></ListItem>
    <ListItem><Label label="🦀 Rust" /></ListItem>
  </ListView>
</template>

<script lang="py">
def on_select(event):
    print(f"选中了第 {event.list_view.index} 项")
</script>
```

## Props

### ListView

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `initial_index` | int | `0` | 初始聚焦（高亮）的列表项索引 |

### ListItem

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| — | — | — | 内容通过默认 slot 传入（通常为 `Label` 或 `Static`）|

## v-model

- `ListView`：`v-model` 默认绑定属性 `items`，绑定列表项数据集合
- `ListItem`：`v-model` 默认绑定属性 `label`

## 事件

| 事件 | 说明 |
|------|------|
| `@list_view_selected` | 列表项被按 Enter 选中时触发（`ListView.Selected`），`event.list_view.index` 为选中索引，`event.item` 为选中的 `ListItem` |
| `@list_view_highlighted` | 键盘移动高亮时触发（`ListView.Highlighted`），`event.list_view.index` 为当前高亮索引 |

## 动态列表示例

```vue
<template>
  <VBox style="height: 1fr;">
    <ListView
      ref="lv_ref"
      :initial_index="0"
      @list_view_selected="on_select"
      @list_view_highlighted="on_highlight"
      style="height: 1fr;"
      border_title="任务列表"
    >
      <ListItem v-for="task in tasks.value" :key="task">
        <Label :label="task" />
      </ListItem>
    </ListView>
    <Label :label="f'已选: {selected.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

lv_ref   = ref(None)
selected = ref("（未选择）")

tasks = ref([
    "📌 完成需求文档",
    "🔧 修复 Issue #42",
    "✅ 代码审查",
    "🚀 发布 v1.2.0",
])

def on_select(event):
    selected.value = tasks.value[event.list_view.index]

def on_highlight(event):
    pass  # 高亮变化时触发，可在此更新预览
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
