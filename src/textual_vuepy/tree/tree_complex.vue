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
