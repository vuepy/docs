---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Log 纯文本滚动日志

Log 是只支持纯文本的滚动日志组件，轻量高效，适合输出大量无样式的日志内容。与 RichLog 相比，Log 不支持 Rich markup 和语法高亮。

> 底层：[Textual `Log`](https://textual.textualize.io/widgets/log/)

## 基本用法

```vue
<template>
  <VBox style="height: 1fr;">
    <Log ref="log_ref" style="height: 1fr;" />
    <Button label="追加日志" @click="append()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import datetime

log_ref = ref(None)

def append():
    now = datetime.datetime.now().strftime("%H:%M:%S")
    log_ref.value.unwrap().write_line(f"[{now}] 事件发生")
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `auto_scroll` | bool | `True` | 是否自动滚动到最新内容 |
| `max_lines` | int | `None` | 最大保留行数，`None` 表示不限制 |

## v-model

`v-model` 默认绑定属性：`lines`

绑定已输出的行列表（只读），通常通过 `ref` 调用方法写入内容。

## 事件

Log 本身不触发特殊事件，通过 `ref` 方式操作内容。

| 事件 | 说明 |
|------|------|
| — | 无（通过 `ref` 操作） |

## 通过 ref 调用方法

| 方法 | 说明 |
|------|------|
| `.write_line(text)` | 写入一行纯文本内容 |
| `.write_lines(lines)` | 批量写入多行内容（传入字符串列表）|
| `.clear()` | 清空所有日志内容 |

```vue
<template>
  <VBox style="height: 1fr;">
    <Log ref="log_ref" :auto_scroll="True" style="height: 1fr;" border_title="运行日志" />
    <HBox style="height: 3;">
      <Button label="追加" @click="append()" />
      <Button label="批量写入" @click="batch_write()" />
      <Button label="清空" @click="clear()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import datetime

log_ref = ref(None)

def append():
    now = datetime.datetime.now().strftime("%H:%M:%S")
    log_ref.value.unwrap().write_line(f"[{now}] 普通日志消息")

def batch_write():
    lines = [f"批量行 {i}" for i in range(1, 6)]
    log_ref.value.unwrap().write_lines(lines)

def clear():
    log_ref.value.unwrap().clear()
</script>
```

## RichLog vs Log 对比

| 特性 | Log | RichLog |
|------|-----|---------|
| Rich markup | ✗ | ✓ |
| 语法高亮 | ✗ | ✓（可选）|
| 自动换行 | ✗ | ✓（可选）|
| 写入方法 | `.write_line()` | `.write()` |
| 性能 | 更高 | 略低 |

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
