<template>
  <VBox>
    <!-- 通过 tooltip 属性设置（推荐）-->
    <Button label="悬停查看提示" tooltip="这是一个提示信息" />
    <Switch v-model="flag.value" tooltip="开启/关闭某功能" />

    <!-- 作为独立组件 -->
    <Tooltip content="独立 Tooltip 组件" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
flag = ref(False)
</script>
