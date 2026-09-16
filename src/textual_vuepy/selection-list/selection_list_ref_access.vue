<template>
  <VBox>
    <SelectionList ref="lang_list">
      <Selection prompt="Go" value="go" />
      <Selection prompt="Python" value="py" :initial_state="True" />
      <Selection prompt="Java" value="java" />
    </SelectionList>
    <HBox>
      <Button label="全选" @click="select_all()" />
      <Button label="清空" @click="clear_all()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

lang_list = ref(None)

def select_all():
    if lang_list.value:
        lang_list.value.unwrap().select_all()

def clear_all():
    if lang_list.value:
        lang_list.value.unwrap().clear_selections()
</script>
