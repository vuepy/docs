<template>
  <VBox>
    <ProgressBar v-model="progress.value" :total="total_steps" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

progress    = ref(0)
total_steps = 200
</script>
