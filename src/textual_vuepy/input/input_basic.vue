<template>
  <VBox>
    <Input v-model="username.value" placeholder="请输入用户名" />
    <Input v-model="password.value" placeholder="请输入密码" password />
    <Input v-model="age.value" type="integer" placeholder="年龄" />
    <Button label="提交" @click="submit()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

username = ref("")
password = ref("")
age = ref("")

def submit():
    print(f"用户名: {username.value}, 年龄: {age.value}")
</script>
