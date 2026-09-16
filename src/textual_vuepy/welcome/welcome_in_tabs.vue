<template>
  <VBox style="height: 1fr;">
    <Header title="My App" subtitle="v1.0.0" />
    <TabbedContent style="height: 1fr;">
      <TabPane title="主页" id="home">
        <VBox style="height: 1fr; align: center middle;">
          <Label label="👋 欢迎使用 My App！" />
        </VBox>
      </TabPane>
      <TabPane title="帮助" id="help">
        <Welcome style="height: 1fr;" />
      </TabPane>
    </TabbedContent>
    <Footer />
  </VBox>
</template>
<script lang="py">
</script>
