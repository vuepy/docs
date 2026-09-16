<template>
  <VBox style="height: 1fr;">
    <Button label="刷新数据" @click="reload()" />
    <VBox style="height: 1fr;" border_title="数据列表">
      <DataTable :cols="['ID', '名称', '状态']" :rows="data_rows.value" style="height: 1fr;" />
      <LoadingIndicator v-model="loading.value" style="height: 1fr; dock: top;" />
    </VBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

loading   = ref(False)
data_rows = ref([
    ("001", "任务 A", "完成"),
    ("002", "任务 B", "进行中"),
    ("003", "任务 C", "待开始"),
])

def reload():
    loading.value = True

    def on_done():
        data_rows.value = [
            ("001", "任务 A", "完成"),
            ("002", "任务 B", "完成"),
            ("003", "任务 C", "进行中"),
            ("004", "任务 D", "待开始"),
        ]
        loading.value = False

    app.tt_app.set_timer(0.5, on_done)
</script>
