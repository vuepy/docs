<template>
  <VBox>
    <!-- 独立使用 RadioButton -->
    <RadioButton label="选项 A" v-model="opt_a.value" />
    <RadioButton label="选项 B" v-model="opt_b.value" />

    <!-- RadioSet 组合使用（推荐，自动互斥）-->
    <RadioSet v-model="selected.value">
      <RadioButton label="Python" />
      <RadioButton label="TypeScript" />
      <RadioButton label="Rust" />
    </RadioSet>
    <Label :label="f'选中索引: {selected.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

opt_a = ref(False)
opt_b = ref(False)
selected = ref(0)
</script>
