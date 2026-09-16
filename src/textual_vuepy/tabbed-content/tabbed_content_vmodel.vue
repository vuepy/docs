<template>
  <VBox style="height: 1fr;">
    <Label>当前标签：{{ active_tab.value }}</Label>
    <TabbedContent v-model="active_tab.value">
      <TabPane title="A 页" id="pane-a">
        <Label label="A 页内容" />
      </TabPane>
      <TabPane title="B 页" id="pane-b">
        <Label label="B 页内容" />
      </TabPane>
    </TabbedContent>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

active_tab = ref("pane-a")
</script>
