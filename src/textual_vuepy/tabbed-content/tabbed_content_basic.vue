<template>
  <VBox style="height: 1fr;">
    <TabbedContent>
      <TabPane title="首页" id="tab-home">
        <Label label="欢迎来到首页" />
      </TabPane>
      <TabPane title="设置" id="tab-settings">
        <Input placeholder="设置项" />
      </TabPane>
      <TabPane title="关于" id="tab-about">
        <Label label="版本 1.0.0" />
      </TabPane>
    </TabbedContent>
  </VBox>
</template>
