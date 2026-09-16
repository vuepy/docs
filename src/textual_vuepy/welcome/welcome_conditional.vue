<template>
  <VBox style="height: 1fr;">
    <Welcome v-if="show_welcome.value" style="height: 1fr;" />
    <VBox v-else style="height: 1fr; align: center middle;">
      <Label label="主界面内容" style="text-style: bold;" />
    </VBox>
    <HBox style="height: 3;" v-if="show_welcome.value">
      <Button label="开始使用" @click="dismiss()" variant="success" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

show_welcome = ref(True)

def dismiss():
    show_welcome.value = False
</script>
