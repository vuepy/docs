<template>
  <ShimmerText text="AI 正在思考..." :running="is_loading.value" />
</template>

<script lang="py">
from vuepy import ref
from vuepy import import_sfc
from pathlib import Path
from textual_vuepy.comps import ShimmerText

is_loading = ref(True)
</script>
