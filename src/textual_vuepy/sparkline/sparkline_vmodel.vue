<template>
  <VBox>
    <Sparkline v-model="metrics.value" style="height: 3;" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

metrics = ref([10, 25, 30, 15, 40, 55, 20, 60, 45, 30])
</script>
