<template>
  <VBox style="height: 1fr;">
    <Tabs v-model="active_tab.value" @tabs_tab_activated="on_tab_change">
      <Tab label="A 面板" id="a" />
      <Tab label="B 面板" id="b" />
      <Tab label="C 面板" id="c" />
    </Tabs>
    <ContentSwitcher v-model="active_tab.value" style="height: 1fr;">
      <VBox id="a" style="padding: 1;">
        <Label label="这是 A 面板的内容" />
      </VBox>
      <VBox id="b" style="padding: 1;">
        <Label label="这是 B 面板的内容" />
        <Input placeholder="在 B 面板中输入..." />
      </VBox>
      <VBox id="c" style="padding: 1;">
        <Label label="这是 C 面板的内容" />
      </VBox>
    </ContentSwitcher>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

active_tab = ref("a")

def on_tab_change(event):
    active_tab.value = str(event.tab.id)
</script>
