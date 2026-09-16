---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# DirectoryTree 目录树

DirectoryTree 以树形结构展示文件系统目录，支持文件/目录点击选中事件，以及通过 `filter_query` 按文件名子串过滤，适合构建文件浏览器或项目浏览工具。

> 底层：Textual `DirectoryTree`（`textual_vuepy` 扩展为可过滤的 `FilterableDirectoryTree`）

## 基本用法

:::textual-vuepy-demo directory_tree_basic
```vue
<template>
  <VBox style="height: 1fr;">
    <DirectoryTree
      path="./"
      style="height: 1fr;"
      @directory_tree_file_selected="on_file_select"
    />
    <Label :label="f'选中: {selected_file.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

selected_file = ref("（未选择）")

def on_file_select(event):
    selected_file.value = str(event.path)
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | str \| Path | — | **必填**，要展示的根目录路径（绝对路径或相对路径均可）|
| `filter_query` | str | `""` | 文件名过滤子串（大小写不敏感）；空字符串表示不过滤。变更后会自动 `reload` |

## v-model

`v-model` 默认绑定属性：`path`

通过 `v-model` 可动态切换展示的根目录路径。

## 事件

| 事件 | 说明 |
|------|------|
| `@directory_tree_file_selected` | 文件节点被选中时触发（`DirectoryTree.FileSelected`），`event.path` 为 `Path` 对象 |
| `@directory_tree_directory_selected` | 目录节点被选中时触发（`DirectoryTree.DirectorySelected`），`event.path` 为 `Path` 对象 |

## 文件过滤示例

:::textual-vuepy-demo directory_tree_filter
```vue
<template>
  <VBox style="height: 1fr;">
    <HBox style="height: 3;">
      <Button label="全部" @click="set_filter('')" />
      <Button label="仅 py" @click="set_filter('py')" />
      <Button label="仅 md" @click="set_filter('md')" />
    </HBox>
    <DirectoryTree
      path="./"
      :filter_query="filter_query.value"
      style="height: 1fr;"
      border_title="文件浏览器"
      @directory_tree_file_selected="on_file"
      @directory_tree_directory_selected="on_dir"
    />
    <Label :label="status.value" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

filter_query = ref("")
status = ref("（未选择）")

def set_filter(query):
    filter_query.value = query

def on_file(event):
    status.value = f"📄 {event.path}"

def on_dir(event):
    status.value = f"📁 {event.path}"
</script>
```
:::

## 与 Tree 组件对比

| 特性 | DirectoryTree | Tree |
|------|:---:|:---:|
| 数据来源 | 文件系统（自动） | 手动构建 |
| 懒加载子目录 | ✓（自动）| 可手动实现 |
| 文件过滤 | ✓（`filter_query` 子串）| — |
| 自定义节点数据 | — | ✓ |

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
