---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Pretty Python 对象格式化展示

Pretty 使用 Rich 的 `Pretty` 渲染器将任意 Python 对象（dict、list、dataclass 等）以美观的格式展示在终端中，自动处理缩进和着色。

> 底层：[Textual `Pretty`](https://textual.textualize.io/widgets/pretty/)

## 基本用法

:::textual-vuepy-demo pretty_basic
```vue
<template>
  <VBox>
    <Pretty :object="sample_data" />
  </VBox>
</template>

<script lang="py">
sample_data = {
    "name": "Vue.py",
    "version": "0.1.0",
    "features": ["reactive", "components", "TUI"],
    "stats": {"users": 1000, "stars": 500},
}
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `object` | any | `None` | 要展示的 Python 对象，支持任意类型（dict、list、tuple、dataclass 等）|

## v-model

不支持

## 事件

| 事件 | 说明 |
|------|------|
| — | Pretty 为纯展示组件，无特殊事件 |

## 展示复杂对象示例

:::textual-vuepy-demo pretty_complex
```vue
<template>
  <VBox style="height: 1fr;">
    <Label label="请求详情：" />
    <Pretty :object="request_info" style="height: 1fr;" border_title="Request" />
  </VBox>
</template>

<script lang="py">
from dataclasses import dataclass

@dataclass
class RequestInfo:
    method: str
    url: str
    status: int
    headers: dict

request_info = RequestInfo(
    method="GET",
    url="https://api.example.com/data",
    status=200,
    headers={"Content-Type": "application/json", "X-Token": "abc123"},
)
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
