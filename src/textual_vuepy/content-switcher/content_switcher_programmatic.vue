<template>
  <VBox style="height: 1fr;">
    <HBox style="height: 3;">
      <Button label="← 上一个" @click="prev()" />
      <Button label="下一个 →" @click="next()" />
    </HBox>
    <ContentSwitcher ref="sw" initial="s1" style="height: 1fr;">
      <VBox id="s1"><Label label="第 1 步" /></VBox>
      <VBox id="s2"><Label label="第 2 步" /></VBox>
      <VBox id="s3"><Label label="第 3 步" /></VBox>
    </ContentSwitcher>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

sw = ref(None)
steps = ["s1", "s2", "s3"]
current_index = ref(0)

def prev():
    current_index.value = max(0, current_index.value - 1)
    sw.value.unwrap().current = steps[current_index.value]

def next():
    current_index.value = min(len(steps) - 1, current_index.value + 1)
    sw.value.unwrap().current = steps[current_index.value]
</script>
