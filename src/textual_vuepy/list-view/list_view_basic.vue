<template>
  <ListView @list_view_selected="on_select" style="height: 1fr;">
    <ListItem><Label label="🐍 Python" /></ListItem>
    <ListItem><Label label="📝 TypeScript" /></ListItem>
    <ListItem><Label label="🦀 Rust" /></ListItem>
  </ListView>
</template>

<script lang="py">
def on_select(event):
    app.message(f"选中了第 {event.list_view.index} 项")
</script>
