<script lang="py">
from textual_vuepy.vueuse import onKeyStroke, useMouse

# 全局按键监听（ctrl+c / ctrl+q 被 Textual 自己占用，换一个键演示）
def handle_quit():
    app.tt_app.exit()

onKeyStroke('ctrl+t', handle_quit)

# 鼠标坐标追踪
mouse_x, mouse_y = useMouse()
</script>

<template>
  <VBox>
    <Label :label="f'鼠标位置: ({mouse_x.value}, {mouse_y.value})'" />
    <Label label="移动鼠标看坐标变化，按 ctrl+t 退出" />
  </VBox>
</template>
