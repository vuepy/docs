<template>
  <VBox style="height: 1fr;">
    <Header title="监控面板" subtitle="实时数据" :show_clock="True" />
    <HBox style="height: 1fr;">
      <!-- 左侧导航 -->
      <VBox style="width: 20; border-right: solid;">
        <ListView style="height: 1fr;">
          <ListItem><Label label="📊 总览" /></ListItem>
          <ListItem><Label label="📈 图表" /></ListItem>
          <ListItem><Label label="⚙️ 设置" /></ListItem>
        </ListView>
      </VBox>
      <!-- 主内容区 -->
      <VBox style="height: 1fr; padding: 1 2;">
        <Label label="欢迎使用监控面板" />
        <Label label="从左侧导航栏选择功能。" />
      </VBox>
    </HBox>
    <Footer />
  </VBox>
</template>
<script lang="py"></script>
