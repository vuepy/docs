<template>
  <VBox>
    <Static content="[bold]粗体文本[/bold]" />
    <Static :content="status_text.value" />
    <!-- 关闭 Rich markup 解析，按原文显示 -->
    <Static content="[非markup内容]" :markup="False" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

status_text = ref("等待中...")
</script>
