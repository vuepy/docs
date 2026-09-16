<template>
  <VBox>
    <Button label="打开对话框" @click="open_dialog()" />
    <Dialog ref="dialog_ref">
      <Label label="这是对话框内容，确认要继续吗？" />
      <template #footer>
        <HBox>
          <Button label="取消" @click="close_dialog()" variant="error" />
          <Button label="确认" @click="confirm()" variant="success" />
        </HBox>
      </template>
    </Dialog>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

dialog_ref = ref(None)

def open_dialog():
    dialog_ref.value.unwrap().open()

def close_dialog():
    dialog_ref.value.unwrap().close()

def confirm():
    print("已确认")
    close_dialog()
</script>
