<template>
  <VBox style="padding: 2 4;">
    <Label label="表单示例" />

    <Label label="用户名：" />
    <Input placeholder="用户名" tooltip="3-20 位字母数字，首字符必须为字母" />

    <Label label="通知：" />
    <Switch
      v-model="notify.value"
      tooltip="开启后将通过邮件接收系统通知"
    />

    <Button
      label="提交"
      variant="primary"
      tooltip="点击提交表单，提交后不可撤回"
      @click="submit()"
    />

    <Button
      label="重置"
      tooltip="清空所有输入内容"
      @click="reset()"
    />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

notify = ref(True)

def submit():
    pass

def reset():
    notify.value = True
</script>
