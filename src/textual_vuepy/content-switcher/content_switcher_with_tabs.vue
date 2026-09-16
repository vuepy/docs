<template>
  <VBox style="height: 1fr;">
    <Tabs @tabs_tab_activated="on_tab_change">
      <Tab label="仪表盘" id="dashboard" />
      <Tab label="配置" id="config" />
    </Tabs>
    <ContentSwitcher v-model="active.value" style="height: 1fr;">
      <VBox id="dashboard" style="padding: 1;">
        <Label label="仪表盘内容" />
      </VBox>
      <VBox id="config" style="padding: 1;">
        <Label label="配置内容" />
        <Input placeholder="配置项..." />
      </VBox>
    </ContentSwitcher>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

active = ref("dashboard")

def on_tab_change(event):
    active.value = str(event.tab.id)
</script>
