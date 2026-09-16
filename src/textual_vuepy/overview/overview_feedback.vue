<template>
  <VBox>
    <Button label="打开对话框" @click="dialog_ref.value.unwrap().open()" />
    <Dialog ref="dialog_ref">
      <Label label="这是对话框内容" />
      <template #footer>
        <Button label="关闭" @click="dialog_ref.value.unwrap().close()" />
      </template>
    </Dialog>
    <ProgressBar :progress="progress.value" :total="100" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

dialog_ref = ref(None)
progress = ref(0)
</script>
