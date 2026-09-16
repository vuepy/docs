<template>
  <VBox>
    <SelectionList ref="list_ref" @selection_list_selected_changed="on_change">
      <Selection prompt="Python" value="py" />
      <Selection prompt="JavaScript" value="js" :initial_state="True" />
      <Selection prompt="Rust" value="rs" />
    </SelectionList>
    <Label :label="f'已选: {selected_str.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

list_ref = ref(None)
selected_str = ref("")

def on_change(event):
    if list_ref.value:
        selected_str.value = str(list_ref.value.unwrap().selected)
</script>
