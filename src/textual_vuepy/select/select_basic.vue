<template>
  <VBox>
    <Select
      v-model="language.value"
      :options="[('Python', 'py'), ('JavaScript', 'js'), ('Rust', 'rs')]"
      prompt="选择语言"
    />
    <Label :label="f'已选: {language.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

language = ref("py")
</script>
