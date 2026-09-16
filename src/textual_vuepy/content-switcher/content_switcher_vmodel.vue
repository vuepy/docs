<template>
  <VBox style="height: 1fr;">
    <HBox style="height: 3;">
      <Button label="首页" @click="show('home')" />
      <Button label="设置" @click="show('settings')" />
    </HBox>
    <Label>当前面板：{{ current_panel.value }}</Label>
    <ContentSwitcher v-model="current_panel.value" ref='cs_ref' style="height: 1fr;">
      <VBox id="home"><Label label="首页" /></VBox>
      <VBox id="settings"><Label label="设置" /></VBox>
    </ContentSwitcher>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

current_panel = ref("settings")
cs_ref = ref(None)

def show(panel: str):
    cs_ref.value.unwrap().current = panel

</script>
