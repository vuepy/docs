<template>
  <VBox>
    <Label label="日期输入（YYYY-MM-DD）：" />
    <MaskedInput template="9999-99-99;" v-model="date.value" />
    <Label label="电话（手机）：" />
    <MaskedInput template="999-9999-9999;" v-model="phone.value" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

date = ref("")
phone = ref("")
</script>
