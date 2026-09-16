<template>
  <VBox>
    <ProgressBar ref="pb_ref" :progress="progress.value" :total="100" style="height: 3;" />
    <HBox style="height: 3;">
      <Button label="+10%" @click="advance()" />
      <Button label="重置" @click="reset()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

pb_ref = ref(None)
progress = ref(0)

def advance():
    progress.value = min(100, progress.value + 10)

def reset():
    progress.value = 0
</script>
