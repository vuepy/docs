<template>
  <VBox style="height: 1fr;">
    <TabbedContent
      initial="tab-home"
      @tabbed_content_tab_activated="on_tab_change"
    >
      <TabPane title="首页" id="tab-home">
        <Label label="首页内容" />
      </TabPane>
      <TabPane title="日志" id="tab-log">
        <Label label="日志内容" />
      </TabPane>
    </TabbedContent>
  </VBox>
</template>

<script lang="py">
def on_tab_change(event):
    tab_id = str(event.tab.id)
    print(f"切换到标签：{tab_id}")
</script>
