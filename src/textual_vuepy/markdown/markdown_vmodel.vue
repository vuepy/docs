<template>
  <VBox style="height: 1fr;">
    <Markdown v-model="content.value" style="height: 1fr;" />
    <Button label="切换内容" @click="toggle()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

content = ref("# 默认内容\n\n这是初始 Markdown。")

page_a = "# 页面 A\n\n这是第一个页面的内容。"
page_b = "# 页面 B\n\n这是第二个页面，有更多 **细节**。"

def toggle():
    content.value = page_b if content.value == page_a else page_a
</script>
