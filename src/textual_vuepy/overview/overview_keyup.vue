<template>
  <VBox
    id="pad"
    ref="pad"
    :can_focus="True"
    @keyup.r="pick('darkred')"
    @keyup.g="pick('darkgreen')"
    @keyup.comma="mark('comma —— , 的按键名')"
    @keyup.ctrl.a="mark('ctrl+a —— 写成 @keyup.ctrl.a')"
    @keyup.shift.a="mark('大写 A —— 写成 @keyup.shift.a')"
    @mouse_move="on_move"
  >
    <Label :label="msg.value" />
    <Label :label="f'鼠标: ({pos.value[0]}, {pos.value[1]})'" />
  </VBox>
</template>

<script lang="py">
from vuepy import onMounted, ref

pad = ref(None)
msg = ref("按 r / g 换色，再试试 , 、ctrl+a 、A")
pos = ref((0, 0))


def pick(color):
    app.tt_app.screen.styles.background = color
    msg.value = f"背景色: {color}"


def mark(name):
    msg.value = f"按下了 {name}"


def on_move(event):
    pos.value = (event.screen_x, event.screen_y)


@onMounted
def focus_pad():
    pad.value.unwrap().focus()  # @keyup 需要该组件持有焦点
</script>

<style lang="tcss">
#pad {
    width: 1fr;
    height: 1fr;
    align: center middle;
}
</style>
