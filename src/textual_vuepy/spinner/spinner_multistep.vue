<template>
  <VBox style="height: 1fr;">
    <Spinner :text="step_text.value" :running="running.value" style="height: 3;" />
    <ProgressBar :progress="progress.value" :total="3" :show_eta="False" style="height: 3;" />
    <Label :label="f'步骤 {progress.value}/3'" />
    <Button label="开始任务" @click="run_task()" :disabled="running.value" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

running   = ref(False)
progress  = ref(0)
step_text = ref("就绪")

steps = [
    "初始化环境...",
    "下载依赖包...",
    "构建项目...",
]

def run_task():
    running.value  = True
    progress.value = 0

    def step(idx):
        if idx < len(steps):
            step_text.value  = steps[idx]
            progress.value   = idx + 1
            app.tt_app.set_timer(1.5, lambda: step(idx + 1))
        else:
            running.value  = False
            step_text.value = "✅ 任务完成！"

    step(0)
</script>
