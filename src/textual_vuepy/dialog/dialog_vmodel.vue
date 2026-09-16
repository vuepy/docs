<template>
  <VBox>
    <Button label="显示" @click="show(True)" />
    <Dialog v-model:value="show_dialog.value">
      <Label label="通过 v-model 控制显隐" />
      <Button label="关闭" @click="show(False)" />
    </Dialog>
  </VBox>
</template>

<script lang="py">
from vuepy import ref
show_dialog = ref(True)

def show(_show: bool = True):
    show_dialog.value = _show
</script>
