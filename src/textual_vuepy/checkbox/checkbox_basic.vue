<template>
  <VBox>
    <Checkbox label="记住我" v-model="remember.value" />
    <Checkbox label="同意条款" v-model="agreed.value" />
    <Checkbox label="已禁用" disabled />
    <Label :label="f'同意状态: {agreed.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

remember = ref(False)
agreed = ref(False)
</script>
