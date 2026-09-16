<template>
  <Collapsible
    title="可观察的折叠区域"
    v-model="is_collapsed.value"
    @collapsible_collapsed="on_collapsed"
    @collapsible_expanded="on_expanded"
  >
    <Label label="内容" />
  </Collapsible>
</template>

<script lang="py">
from vuepy import ref

is_collapsed = ref(False)

def on_collapsed(event):
    print("已折叠")

def on_expanded(event):
    print("已展开")
</script>
