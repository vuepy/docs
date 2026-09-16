<template>
  <VBox style="height: 1fr;">
    <ListView
      ref="lv_ref"
      :initial_index="0"
      @list_view_selected="on_select"
      @list_view_highlighted="on_highlight"
      style="height: 1fr;"
      border_title="任务列表"
    >
      <ListItem v-for="task in tasks.value">
        <Label :label="task" />
      </ListItem>
    </ListView>
    <Label :label="f'已选: {selected.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

lv_ref   = ref(None)
selected = ref("（未选择）")

tasks = ref([
    "📌 完成需求文档",
    "🔧 修复 Issue #42",
    "✅ 代码审查",
    "🚀 发布 v1.2.0",
])

def on_select(event):
    selected.value = tasks.value[event.list_view.index]

def on_highlight(event):
    pass  # 高亮变化时触发，可在此更新预览
</script>
