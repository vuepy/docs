<template>
  <VBox>
    <Button label="添加用户" @click="open_dialog()" />
    <Dialog ref="form_dialog" name="add-user-dialog" style="min-height: 20;">
      <VBox style="height: auto;">
        <Label label="用户名：" />
        <Input v-model="username.value" placeholder="请输入用户名" />
        <Label label="邮箱：" />
        <Input v-model="email.value" placeholder="请输入邮箱" />
      </VBox>
      <template #footer>
        <HBox>
          <Button label="取消" @click="cancel()" />
          <Button label="提交" @click="submit()" variant="primary" />
        </HBox>
      </template>
    </Dialog>
    <Label :label="result.value" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

form_dialog = ref(None)
username    = ref("")
email       = ref("")
result      = ref("")

def open_dialog():
    form_dialog.value.open()

def cancel():
    form_dialog.value.close()

def submit():
    result.value = f"已提交: {username.value} <{email.value}>"
    form_dialog.value.close()
</script>
