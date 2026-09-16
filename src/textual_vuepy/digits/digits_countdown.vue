<template>
  <VBox style="height: 1fr; align: center middle;">
    <Digits :value="countdown_str.value" />
    <Label :label="status_label.value" />
    <HBox style="height: 3;">
      <Button label="开始倒计时" @click="start()" />
      <Button label="重置" @click="reset()" variant="warning" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

remaining = ref(5)
running   = ref(False)

countdown_str = ref(f"00:{remaining.value:02d}")
status_label  = ref("就绪")

def _update_str():
    m = remaining.value // 60
    s = remaining.value % 60
    countdown_str.value = f"{m:02d}:{s:02d}"

def tick():
    if running.value and remaining.value > 0:
        remaining.value -= 1
        _update_str()
        app.tt_app.set_timer(1, tick)
    elif remaining.value == 0:
        status_label.value = "⏰ 时间到！"
        running.value = False

def start():
    if not running.value:
        running.value = True
        status_label.value = "倒计时中..."
        tick()

def reset():
    running.value = False
    remaining.value = 5
    _update_str()
    status_label.value = "就绪"
</script>
