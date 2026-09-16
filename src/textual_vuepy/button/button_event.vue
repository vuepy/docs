<template>
  <HBox>
    <Button :label="btn_label.value" @click="on_click()" style="background: blue;"/>
  </HBox>
</template>

<script lang="py">
from vuepy import ref

btn_label = ref("dynamic label")

def on_click():
    btn_label.value = "button clicked"
</script>
