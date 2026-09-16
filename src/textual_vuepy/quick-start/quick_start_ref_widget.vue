<template>
  <RichLog ref="log_ref" highlight markup />
</template>

<script lang="py">
from vuepy import ref, onMounted

log_ref = ref(None)

@onMounted
def on_mount():
    widget = log_ref.value.unwrap()  # 获取 Textual RichLog widget
    widget.write("[bold green]Hello[/bold green]")
    widget.focus()
</script>
