<template>
  <VBox style="height: 1fr;">
    <Button label="切换" @click="toggle()" />
    <Label :label="f'show={loading.value}'" />
    <LoadingIndicator v-model="loading.value" style="height: 5;" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
loading = ref(True)

def toggle():
    loading.value = not loading.value
</script>
