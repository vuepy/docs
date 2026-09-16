<template>
  <VBox style="height: 1fr;">
    <RichLog ref="log_ref" markup highlight wrap style="height: 1fr;"
             border_title="系统日志" />
    <HBox style="height: 3;">
      <Button label="INFO"  @click="log_info()" />
      <Button label="ERROR" @click="log_error()" variant="error" />
      <Button label="清空"  @click="clear()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import datetime

log_ref = ref(None)

def _ts():
    return datetime.datetime.now().strftime("%H:%M:%S")

def log_info():
    log_ref.value.unwrap().write(f"[dim]{_ts()}[/dim] [green]INFO[/green]  操作成功")

def log_error():
    log_ref.value.unwrap().write(f"[dim]{_ts()}[/dim] [bold red]ERROR[/bold red] 发生异常")

def clear():
    log_ref.value.unwrap().clear()
</script>
