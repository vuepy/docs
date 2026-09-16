<template>
  <VBox>
    <ShimmerText text="AI 正在思考..." :running="is_loading.value" />
    <HBox>
      <Button label="开始" @click="switch(True)" />
      <Button label="停止" @click="switch(False)" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

is_loading = ref(False)

def switch(loading: bool):
    is_loading.value = loading
</script>
