<template>
  <VBox>
    <Button label="切换折叠" @click="toggle()" />
    <Collapsible title="内容区域" v-model="collapsed.value">
      <Label label="可折叠的内容" />
    </Collapsible>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

collapsed = ref(False)

def toggle():
    collapsed.value = not collapsed.value
</script>
