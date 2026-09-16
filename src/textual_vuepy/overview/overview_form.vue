<template>
  <VBox>
    <Input v-model="name.value" placeholder="请输入姓名" />
    <Select v-model="lang.value"
            :options="[('Python', 'py'), ('TypeScript', 'ts')]" />
    <Switch v-model="enabled.value" />
    <Checkbox label="同意条款" v-model="agreed.value" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

name = ref("")
lang = ref("py")
enabled = ref(True)
agreed = ref(False)
</script>
