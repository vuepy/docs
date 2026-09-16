<template>
  <VBox style="height: 1fr;">
    <ProgressBar
      ref="pb_ref"
      :progress="dl_progress.value"
      :total="100"
      :show_eta="True"
      style="height: 3;"
      border_title="下载进度"
    />
    <Label :label="status.value" />
    <HBox style="height: 3;">
      <Button label="开始下载" @click="start_download()" />
      <Button label="重置" @click="reset()" variant="warning" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

pb_ref      = ref(None)
dl_progress = ref(0)
status      = ref("就绪")

def tick():
    if dl_progress.value < 100:
        dl_progress.value = min(100, dl_progress.value + 5)
        status.value = f"下载中... {dl_progress.value}%"
        app.tt_app.set_timer(0.2, tick)
    else:
        status.value = "✅ 下载完成！"

def start_download():
    dl_progress.value = 0
    status.value = "开始下载..."
    tick()

def reset():
    dl_progress.value = 0
    status.value = "就绪"
</script>
