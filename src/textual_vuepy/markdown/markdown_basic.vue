<template>
  <VBox style="height: 1fr;">
    <!-- 基础 Markdown 渲染 -->
    <Markdown :markdown="md_content" style="height: 1fr;" />

    <!-- Markdown 查看器（含目录）-->
    <MarkdownViewer :markdown="md_content" style="height: 1fr;" />

    <!-- 使用 content slot -->
    <Markdown>
## 标题
这是 **Markdown** 内容。
    </Markdown>
  </VBox>
</template>

<script lang="py">
md_content = """
# Vue.py

Vue.py 是基于 Python 的响应式框架。

## 特性
- 响应式数据
- 组件化开发
- 支持多后端
"""
</script>
