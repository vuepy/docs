---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# VueUse 组合式函数

Textual-vuepy 在 `textual_vuepy.vueuse` 中提供了一组组合式函数（Composables），在 `<script lang="py">` 顶层调用即可，无需手写 Textual 的 binding 或事件处理方法。

| 函数 | 说明 | 返回值 |
|------|------|--------|
| `onKeyStroke(key, cb)` | 注册全局按键监听（组件 `onMounted` 后生效），`cb` 不接收参数 | — |
| `useMouse()` | 追踪鼠标屏幕坐标 | `(x: Ref[int], y: Ref[int])` |

## onKeyStroke 全局按键监听

```python
from textual_vuepy.vueuse import onKeyStroke

onKeyStroke(key, cb)
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `key` | str | 按键名，如 `'r'`、`'ctrl+a'`、`'comma'`；单个函数只监听一个键 |
| `cb` | Callable | 按键触发时调用，**不接收任何参数** |

- 在 `setup` 顶层调用，实际注册发生在 `onMounted` 之后。
- 底层是 Textual 的 App binding，因此 `cb` 的 **docstring 会作为快捷键说明显示在 `<Footer />` 上**。
- 监听多个键就调用多次 `onKeyStroke`。

:::textual-vuepy-demo vueuse_on_key_stroke
```vue
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
```
:::

### 用 `vuepy run keys` 探测按键名 {#probe-keys}

`key` 用的是 Textual 的按键名，普通字母数字就是它本身（`'r'`、`'7'`），但特殊符号和功能键有专门的名字，写错了不会报错、只是监听不到。不确定时用内置的 keys 应用探一下：

```sh
vuepy run keys
```

按下想要监听的按键或组合键，日志会打印这次的 `Key` 事件，其中 **`key=` 的值就是传给 `onKeyStroke` 的按键名**：

```text
Key(key='comma', character=',', name='comma', is_printable=True)
Key(key='question_mark', character='?', name='question_mark', is_printable=True)
Key(key='ctrl+a', character=None, name='ctrl_a', is_printable=False)
Key(key='f5', character=None, name='f5', is_printable=False)
```

所以监听逗号要写 `onKeyStroke('comma', cb)`，而不是 `onKeyStroke(',', cb)`。

常见符号对照（完整列表以 keys 应用的实测结果为准）：

| 按键 | key 名 | 按键 | key 名 |
|------|--------|------|--------|
| `,` | `comma` | `.` | `full_stop` |
| `/` | `slash` | `\` | `backslash` |
| `;` | `semicolon` | `:` | `colon` |
| `'` | `apostrophe` | `"` | `quotation_mark` |
| `-` | `minus` | `_` | `underscore` |
| `=` | `equals_sign` | `+` | `plus` |
| `[` `]` | `left_square_bracket` / `right_square_bracket` | `{` `}` | `left_curly_bracket` / `right_curly_bracket` |
| `(` `)` | `left_parenthesis` / `right_parenthesis` | `<` `>` | `less_than_sign` / `greater_than_sign` |
| `?` | `question_mark` | `!` | `exclamation_mark` |
| `@` | `at` | `#` | `number_sign` |
| `$` | `dollar_sign` | `%` | `percent_sign` |
| `^` | `circumflex_accent` | `&` | `ampersand` |
| `*` | `asterisk` | `~` | `tilde` |
| `` ` `` | `grave_accent` | `\|` | `vertical_line` |
| 空格 | `space` | Tab | `tab` |

组合键与功能键直接按 Textual 写法：`ctrl+a`、`shift+down`、`ctrl+shift+p`、`escape`、`enter`、`f1`~`f12`、`up` / `down` / `left` / `right`、`home` / `end`、`pageup` / `pagedown`、`backspace` / `delete`。

::: warning Textual 占用的按键监听不到
`onKeyStroke` 走 Textual binding，被 Textual 自己占用的键不会传到回调：`ctrl+c` 只弹出 "Press ctrl+q to quit" 提示，`ctrl+q` 直接退出应用，`ctrl+p` 打开命令面板。挑一个未被占用的键即可（例如 `ctrl+t`）。

另外，焦点在 `Input`、`TextArea` 这类输入控件上时，可打印字符会被控件消费，此时单字符按键监听不会触发。
:::

## useMouse 鼠标坐标追踪

```python
from textual_vuepy.vueuse import useMouse

x, y = useMouse()
```

返回两个 `Ref[int]`，分别是鼠标相对**屏幕**的列、行坐标（`MouseEvent.screen_x` / `screen_y`），鼠标移动时自动更新，可直接用于模板插值或计算属性。

:::textual-vuepy-demo vueuse_use_mouse
```vue
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
    """退出"""
    app.tt_app.exit()


onKeyStroke("ctrl+t", quit_app)
</script>
```
:::

> 只关心某个容器内的鼠标事件时，用组件事件更合适：`<VBox @mouse_move="on_move" />`，回调会收到 Textual 的 `MouseEvent`。

## 深入了解

- [组件总览](/textual_vuepy/overview/overview#vueuse) — 全部组件与能力速查
- [Textual Input / Keys](https://textual.textualize.io/guide/input/) — 底层按键与鼠标事件模型
