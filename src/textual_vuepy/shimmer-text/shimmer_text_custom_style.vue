<template>
  <VBox style="height: 1fr; align: center middle;">
    <ShimmerText
      text="Loading System..."
      :highlight_width="4"
      :interval="0.05"
      :running="True"
      style="height: 3;"
      class="bold"
    />
  </VBox>
</template>
<script lang="py">
</script>
<style lang="tcss">
.bold {
  text-style: bold;
  color: cyan;
}
</style>
