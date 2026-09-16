<template>
  <VBox>
    <Pretty :object="sample_data" />
  </VBox>
</template>

<script lang="py">
sample_data = {
    "name": "Vue.py",
    "version": "0.1.0",
    "features": ["reactive", "components", "TUI"],
    "stats": {"users": 1000, "stars": 500},
}
</script>
