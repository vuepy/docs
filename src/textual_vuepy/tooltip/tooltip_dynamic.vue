<template>
  <VBox>
    <Button
      label="操作按钮"
      :tooltip="btn_tip.value"
      :disabled="is_busy.value"
      @click="do_action()"
    />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

is_busy = ref(False)
btn_tip = ref("点击执行操作")

def do_action():
    is_busy.value = True
    btn_tip.value = "操作执行中，请稍候..."
    def done():
        is_busy.value = False
        btn_tip.value = "操作已完成，可再次点击"
    app.tt_app.set_timer(2, done)
</script>
