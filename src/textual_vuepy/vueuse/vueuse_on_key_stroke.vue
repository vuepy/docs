<template>
  <VBox>
    <HBox id="panel">
      <Label :label="msg.value" />
    </HBox>
    <Footer />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
from textual_vuepy.vueuse import onKeyStroke

msg = ref("按 r / g / b 换色，按 , 计数，ctrl+t 退出")
count = ref(0)


def switch_color(color):
    app.tt_app.screen.styles.background = color
    msg.value = f"背景色: {color}"


def to_red():
    """红色"""
    switch_color("darkred")


def to_green():
    """绿色"""
    switch_color("darkgreen")


def to_blue():
    """蓝色"""
    switch_color("darkblue")


def count_comma():
    """逗号计数"""
    count.value += 1
    msg.value = f"comma 已按 {count.value} 次"


def quit_app():
    """退出"""
    app.tt_app.exit()


onKeyStroke("r", to_red)
onKeyStroke("g", to_green)
onKeyStroke("b", to_blue)
onKeyStroke("comma", count_comma)   # 注意：不是 ","
onKeyStroke("ctrl+t", quit_app)
</script>

<style lang="tcss">
#panel {
    width: 1fr;
    height: 1fr;
    align: center middle;
}
</style>
