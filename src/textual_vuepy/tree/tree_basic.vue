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
