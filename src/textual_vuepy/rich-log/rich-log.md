---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# RichLog 富文本滚动日志

RichLog 是支持 Rich markup 的滚动日志组件，可自动语法高亮，适合展示带样式的实时日志输出。

> 底层：[Textual `RichLog`](https://textual.textualize.io/widgets/rich_log/)

## 基本用法

:::textual-vuepy-demo rich_log_basic
```vue
<template>
  <VBox style="height: 1fr;">
    <RichLog ref="log_ref" highlight markup style="height: 1fr;" />
    <HBox style="height: 3;">
      <Button label="写入" @click="write_log()" />
      <Button label="清空" @click="clear_log()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref, onMounted

log_ref = ref(None)

def write_log():
    log_ref.value.unwrap().write("[bold green]新消息[/bold green]: 操作完成")

def clear_log():
    log_ref.value.unwrap().clear()
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `markup` | bool | `False` | 是否解析 Rich markup（如 `[bold]text[/bold]`），声明即为 `True` |
| `wrap` | bool | `False` | 长行是否自动换行，声明即为 `True` |
| `highlight` | bool | `False` | 是否自动语法高亮（如 URL、数字等），声明即为 `True` |
| `auto_scroll` | bool | `True` | 是否自动滚动到最新内容 |
| `max_lines` | int | `None` | 最大保留行数，`None` 表示不限制 |

> `markup`、`wrap`、`highlight` 均为 `store_true` 类型属性，在模板中直接声明即视为 `True`，无需 `:markup="True"`。

## v-model

`v-model` 默认绑定属性：`lines`

绑定已输出的行列表（只读），通常不通过 `v-model` 修改内容，而是通过 `ref` 调用方法写入。

## 事件

RichLog 本身不触发特殊事件，通过 `ref` 方式操作内容。

| 事件 | 说明 |
|------|------|
| — | 无（通过 `ref` 操作） |

## 通过 ref 调用方法

| 方法 | 说明 |
|------|------|
| `.write(text)` | 写入一条内容（支持 Rich 对象、Markup、字符串） |
| `.clear()` | 清空所有日志内容 |

:::textual-vuepy-demo rich_log_ref_methods
```vue
<template>
  <VBox style="height: 1fr;">
    <RichLog ref="log_ref" markup highlight wrap style="height: 1fr;"
             border_title="系统日志" />
    <HBox style="height: 3;">
      <Button label="INFO"  @click="log_info()" />
      <Button label="ERROR" @click="log_error()" variant="error" />
      <Button label="清空"  @click="clear()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import datetime

log_ref = ref(None)

def _ts():
    return datetime.datetime.now().strftime("%H:%M:%S")

def log_info():
    log_ref.value.unwrap().write(f"[dim]{_ts()}[/dim] [green]INFO[/green]  操作成功")

def log_error():
    log_ref.value.unwrap().write(f"[dim]{_ts()}[/dim] [bold red]ERROR[/bold red] 发生异常")

def clear():
    log_ref.value.unwrap().clear()
</script>
```
:::

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
