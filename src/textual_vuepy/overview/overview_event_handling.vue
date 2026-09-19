<template>
  <Input @input_submitted="on_submit" placeholder="test on input submitted"/>
  <DirectoryTree path="./" @directory_tree_file_selected="on_file_selected" />
  <VBox @mouse_up="on_mouse_up" style="background: goldenrod; height: 1fr;">
    test on mouse up
  </VBox>
</template>
<script lang="py">
def on_submit(event):
    app.message(f"submit: {event.value}")

def on_file_selected(event):
    app.message(f"file selected: {event.path.name}")

def on_mouse_up(event):
    app.message(f"mouse up: {event.x}, {event.y}")
</script>
