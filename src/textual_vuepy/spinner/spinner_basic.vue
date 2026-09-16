<template>
  <VBox>
    <Spinner text="处理中，请稍候..." :running="processing.value" />
    <Button label="开始处理" @click="start()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

processing = ref(False)

def start():
    processing.value = True
    def done():
        processing.value = False
    app.tt_app.set_timer(3, done)
</script>
