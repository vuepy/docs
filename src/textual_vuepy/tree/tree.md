---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Tree 树形结构组件

Tree 以可折叠的树形结构展示层级数据，支持键盘导航和节点展开/折叠操作，适合文件系统、组织架构、JSON 结构等场景。

> 底层：[Textual `Tree`](https://textual.textualize.io/widgets/tree/)

## 基本用法

:::textual-vuepy-demo tree_basic
```vue
<template>
  <Tree ref="tree_ref" label="根节点" style="height: 1fr;"
        @tree_node_selected="on_select" />
</template>

<script lang="py">
from vuepy import ref, onMounted

tree_ref = ref(None)

@onMounted
def build_tree():
    tree = tree_ref.value.unwrap()
    node_a = tree.root.add("目录 A")
    node_a.add_leaf("文件 1")
    node_a.add_leaf("文件 2")
    node_b = tree.root.add("目录 B", expand=True)
    node_b.add_leaf("文件 3")
    tree.root.expand()

def on_select(event):
    print(f"选中: {event.node.label}")
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | str | `"Tree"` | 根节点显示的标签文字 |

## v-model

`v-model` 默认绑定属性：`data`

可通过 `v-model` 绑定树形结构数据（通常为嵌套字典/列表），或在 `onMounted` 钩子中通过 `ref` 手动构建树。

## 事件

| 事件 | 说明 |
|------|------|
| `@tree_node_selected` | 节点被 Enter 选中时触发（`Tree.NodeSelected`），`event.node` 为被选节点，`event.node.label` 为节点标签 |
| `@tree_node_expanded` | 节点被展开时触发（`Tree.NodeExpanded`），`event.node` 为被展开节点 |
| `@tree_node_collapsed` | 节点被折叠时触发（`Tree.NodeCollapsed`），`event.node` 为被折叠节点 |

## 通过 ref 操作节点

树的节点通过 `ref` 获取底层 Textual widget 后，使用以下方法构建和操作：

| 方法 | 说明 |
|------|------|
| `tree.root.add(label, data=None, expand=False)` | 在根节点下添加可展开的子节点 |
| `tree.root.add_leaf(label, data=None)` | 在根节点下添加叶子节点（不可展开）|
| `node.add(label, data=None)` | 在任意节点下添加子节点 |
| `node.add_leaf(label, data=None)` | 在任意节点下添加叶子节点 |
| `tree.root.expand()` | 展开根节点 |
| `tree.root.expand_all()` | 展开全部节点 |
| `tree.root.collapse()` | 折叠根节点 |
| `node.data` | 节点附带的自定义数据（任意类型）|

## 复杂树示例

:::textual-vuepy-demo tree_complex
```vue
<template>
  <VBox style="height: 1fr;">
    <Tree
      ref="tree_ref"
      label="📁 项目"
      style="height: 1fr;"
      border_title="文件浏览器"
      @tree_node_selected="on_select"
      @tree_node_expanded="on_expand"
    />
    <Label :label="f'当前: {current_path.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref, onMounted

tree_ref     = ref(None)
current_path = ref("（未选择）")

@onMounted
def build():
    tree = tree_ref.value.unwrap()

    src = tree.root.add("📂 src", expand=True)
    comp = src.add("📂 components", expand=True)
    comp.add_leaf("📄 Button.vue")
    comp.add_leaf("📄 Input.vue")
    src.add_leaf("📄 main.py")
    src.add_leaf("📄 app.vue")

    docs = tree.root.add("📂 docs")
    docs.add_leaf("📄 README.md")

    tree.root.add_leaf("📄 pyproject.toml")
    tree.root.expand()

def on_select(event):
    current_path.value = str(event.node.label)

def on_expand(event):
    pass  # 可在展开时懒加载子节点
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
