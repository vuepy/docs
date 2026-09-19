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
    status.value = f"📄 {event.path.name}"

def on_dir(event):
    status.value = f"📁 {event.path.name}"
</script>
