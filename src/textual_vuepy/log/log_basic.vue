<template>
  <VBox style="height: 1fr;">
    <Log ref="log_ref" style="height: 1fr;" />
    <Button label="追加日志" @click="append()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import datetime

log_ref = ref(None)

def append():
    now = datetime.datetime.now().strftime("%H:%M:%S")
    log_ref.value.unwrap().write_line(f"[{now}] 事件发生")
</script>
