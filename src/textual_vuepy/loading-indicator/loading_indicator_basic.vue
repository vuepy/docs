<template>
  <VBox style="height: 1fr;">
    <LoadingIndicator :show="is_loading.value" />
    <Button label="模拟加载" @click="simulate_load()" />
    <VBox v-if="not is_loading.value" style="height: 1fr;">
      <Label label="内容已加载完成！" />
    </VBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

is_loading = ref(False)

def simulate_load():
    is_loading.value = True
    def done():
        is_loading.value = False
    app.tt_app.set_timer(2, done)
</script>
