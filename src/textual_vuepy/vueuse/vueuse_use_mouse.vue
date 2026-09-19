<template>
  <VBox>
    <Label :label="f'鼠标位置: ({x.value}, {y.value})'" />
    <Label :label="f'所在区域: {area.value}'" />
    <Label label="移动鼠标看坐标变化，按 ctrl+t 退出" />
  </VBox>
</template>

<script lang="py">
from vuepy import computed
from textual_vuepy.vueuse import onKeyStroke, useMouse

x, y = useMouse()

area = computed(lambda: "上半屏" if y.value < 15 else "下半屏")


def quit_app():
    app.tt_app.exit()


onKeyStroke("ctrl+t", quit_app)
</script>
