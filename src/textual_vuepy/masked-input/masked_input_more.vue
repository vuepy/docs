<template>
  <VBox>
    <!-- 身份证号 -->
    <Label label="身份证号：" />
    <MaskedInput template="999999-9999-9999-9999;" v-model="id_card.value" />

    <!-- IP 地址 -->
    <Label label="IP 地址：" />
    <MaskedInput template="990.990.990.990;" v-model="ip.value" />

    <Button label="确认" @click="confirm()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

id_card = ref("")
ip = ref("")

def confirm():
    print(f"身份证: {id_card.value}, IP: {ip.value}")
</script>
