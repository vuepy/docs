---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Digits 大号数字显示

Digits 以仿 LCD 风格渲染大号数字字符，适合展示时钟、计时器、倒计时、计数器等场景，视觉冲击力强。

> 底层：[Textual `Digits`](https://textual.textualize.io/widgets/digits/)

## 基本用法

```vue
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
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | str \| float | `""` | 要显示的内容，支持数字 `0-9`、冒号 `:`、小数点 `.` 及空格 |

> **提示**：`value` 仅支持上述特定字符，传入其他字符可能无法正常渲染。

## v-model

`v-model` 默认绑定属性：`value`

通过 `v-model` 可双向绑定显示内容，实现动态数字更新。

## 事件

| 事件 | 说明 |
|------|------|
| — | Digits 为纯展示组件，无特殊事件 |

## 倒计时示例

```vue
<template>
  <VBox style="height: 1fr; align: center middle;">
    <Digits :value="countdown_str.value" style="color: $accent;" />
    <Label :label="status_label.value" />
    <HBox style="height: 3;">
      <Button label="开始倒计时" @click="start()" />
      <Button label="重置" @click="reset()" variant="warning" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

remaining = ref(60)
running   = ref(False)

countdown_str = ref("01:00")
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
    remaining.value = 60
    _update_str()
    status_label.value = "就绪"
</script>
```

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
