<template>
  <VBox>
    <Switch v-model="dark_mode.value" tooltip="暗色模式" />
    <Switch v-model="auto_save.value" tooltip="自动保存" />
    <Label :label="f'暗色模式: {dark_mode.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

dark_mode = ref(False)
auto_save = ref(True)
</script>
