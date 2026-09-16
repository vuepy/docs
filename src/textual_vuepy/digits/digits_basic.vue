<template>
  <VBox style="align: center middle;">
    <Digits :value="clock_str.value" />
    <HBox>
      <Button label="开始" @click="start_timer()" />
      <Button label="停止" @click="stop_timer()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import datetime

clock_str = ref("00:00:00")
running = ref(False)

def tick():
    if running.value:
        clock_str.value = datetime.datetime.now().strftime("%H:%M:%S")
        app.tt_app.set_timer(1, tick)

def start_timer():
    running.value = True
    tick()

def stop_timer():
    running.value = False
</script>
