<template>
  <VBox>
    <Label label="普通文本" />
    <Label label="[bold red]加粗红色[/bold red]" />
    <Label :label="f'计数: {count.value}'" />
    <!-- 使用 content slot -->
    <Label>带内容的标签</Label>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

count = ref(0)
</script>
