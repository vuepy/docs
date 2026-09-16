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
