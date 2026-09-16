<template>
  <VBox style="height: 1fr;">
    <Log ref="log_ref" :auto_scroll="True" style="height: 1fr;" border_title="运行日志" />
    <HBox style="height: 3;">
      <Button label="追加" @click="append()" />
      <Button label="批量写入" @click="batch_write()" />
      <Button label="清空" @click="clear()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import datetime

log_ref = ref(None)

def append():
    now = datetime.datetime.now().strftime("%H:%M:%S")
    log_ref.value.unwrap().write_line(f"[{now}] 普通日志消息")

def batch_write():
    lines = [f"批量行 {i}" for i in range(1, 6)]
    log_ref.value.unwrap().write_lines(lines)

def clear():
    log_ref.value.unwrap().clear()
</script>
