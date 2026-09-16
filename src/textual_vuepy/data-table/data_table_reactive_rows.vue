<template>
  <VBox style="height: 1fr;">
    <Button label="刷新数据" @click="reload()" />
    <DataTable
      :cols="['ID', '名称', '状态']"
      :rows="data_rows.value"
      zebra_stripes
      style="height: 1fr;"
    />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

data_rows = ref([
    ("001", "任务 A", "完成"),
    ("002", "任务 B", "进行中"),
    ("003", "任务 C", "待开始"),
])

def reload():
    data_rows.value = [
        ("001", "任务 A", "完成"),
        ("002", "任务 B", "完成"),
        ("003", "任务 C", "进行中"),
        ("004", "任务 D", "待开始"),
    ]
</script>
