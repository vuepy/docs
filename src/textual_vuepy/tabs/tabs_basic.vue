<template>
  <VBox style="height: 1fr;">
    <Tabs @tabs_tab_activated="on_tab_change">
      <Tab label="概览" id="overview" />
      <Tab label="详情" id="detail" />
      <Tab label="日志" id="logs" />
    </Tabs>
    <Label>当前选中：{{ active.value }}</Label>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

active = ref("overview")

def on_tab_change(event):
    active.value = str(event.tab.id)
</script>
