<template>
  <VBox>
    <OptionList ref="ol_ref" @option_list_option_selected="on_select" style="height: 10;">
      <Option prompt="苹果" id="apple" />
      <Option prompt="香蕉" id="banana" />
      <Option prompt="樱桃" id="cherry" />
    </OptionList>
    <Label :label="f'已选: {selected_item.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

ol_ref = ref(None)
selected_item = ref("无")

def on_select(event):
    selected_item.value = str(event.option.prompt)
</script>
