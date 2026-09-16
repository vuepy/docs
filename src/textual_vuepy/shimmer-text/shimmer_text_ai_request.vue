<template>
  <VBox style="height: 1fr;">
    <ShimmerText
      text="AI 正在生成回答，请稍候..."
      :highlight_width="5"
      :interval="0.08"
      :running="generating.value"
      style="height: 3;"
    />
    <RichLog ref="output_log" markup highlight style="height: 1fr;" border_title="AI 输出" />
    <HBox style="height: 3;">
      <Input v-model="user_input.value" placeholder="输入问题..." style="width: 1fr;" />
      <Button label="发送" @click="send()" :disabled="generating.value" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

generating  = ref(False)
user_input  = ref("")
output_log  = ref(None)

def send():
    if not user_input.value.strip():
        return
    generating.value = True
    question = user_input.value
    user_input.value = ""

    def on_response():
        output_log.value.unwrap().write(
            f"[bold cyan]Q:[/bold cyan] {question}\n"
            f"[bold green]A:[/bold green] 这是一个模拟的 AI 回答。\n"
        )
        generating.value = False

    # 模拟 AI 请求延迟
    app.tt_app.set_timer(2, on_response)
</script>
