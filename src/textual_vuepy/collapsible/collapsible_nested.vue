<template>
  <VBox style="height: 1fr; padding: 1;">
    <Collapsible title="一级菜单 A">
      <Label label="菜单项 A-1" />
      <Collapsible title="二级菜单 A-2">
        <Label label="菜单项 A-2-1" />
        <Label label="菜单项 A-2-2" />
      </Collapsible>
    </Collapsible>
    <Collapsible title="一级菜单 B" :collapsed="True">
      <Label label="默认折叠的内容" />
    </Collapsible>
  </VBox>
</template>
