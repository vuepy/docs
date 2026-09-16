<template>
  <VBox style="height: 1fr;">
    <RichLog ref="log_ref" highlight markup style="height: 1fr;" />
    <Button label="写入日志" @click="write_log()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref, onMounted

log_ref = ref(None)

def write_log():
    log_ref.value.unwrap().write("[bold cyan]event happened[/bold cyan]")

@onMounted
def on_mounted():
    write_log()

</script>
