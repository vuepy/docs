<template>
  <VBox style="height: 1fr;">
    <HBox style="height: 3;">
      <Button label="显示 A" @click="show('panel-a')" />
      <Button label="显示 B" @click="show('panel-b')" />
    </HBox>
    <ContentSwitcher ref="switcher_ref" initial="panel-a" style="height: 1fr;">
      <VBox id="panel-a" style="padding: 1;">
        <Label label="面板 A 的内容" />
      </VBox>
      <VBox id="panel-b" style="padding: 1;">
        <Label label="面板 B 的内容" />
      </VBox>
    </ContentSwitcher>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

switcher_ref = ref(None)

def show(panel: str):
    switcher_ref.value.unwrap().current = panel
</script>
