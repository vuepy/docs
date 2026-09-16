<template>
  <Collapsible title="详细信息" v-model="is_collapsed.value">
    <Label label="折叠内容在这里" />
    <Input placeholder="输入内容" />
  </Collapsible>
</template>

<script lang="py">
from vuepy import ref

is_collapsed = ref(False)
</script>
