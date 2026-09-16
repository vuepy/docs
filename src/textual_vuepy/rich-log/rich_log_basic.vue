<template>
  <VBox style="height: 1fr;">
    <RichLog ref="log_ref" highlight markup style="height: 1fr;" />
    <HBox style="height: 3;">
      <Button label="写入" @click="write_log()" />
      <Button label="清空" @click="clear_log()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref, onMounted

log_ref = ref(None)

def write_log():
    log_ref.value.unwrap().write("[bold green]新消息[/bold green]: 操作完成")

def clear_log():
    log_ref.value.unwrap().clear()
</script>
