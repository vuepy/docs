---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Pretty Python 对象格式化展示

Pretty 使用 Rich 的 `Pretty` 渲染器将任意 Python 对象（dict、list、dataclass 等）以美观的格式展示在终端中，自动处理缩进和着色。

> 底层：[Textual `Pretty`](https://textual.textualize.io/widgets/pretty/)

## 基本用法

```vue
<template>
  <VBox>
    <Pretty :data="sample_data" />
    <Button label="刷新" @click="refresh()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

sample_data = ref({
    "name": "Vue.py",
    "version": "0.1.0",
    "features": ["reactive", "components", "TUI"],
    "stats": {"users": 1000, "stars": 500},
})

def refresh():
    sample_data.value = {"updated": True, "timestamp": "now"}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | any | `None` | 要展示的 Python 对象，支持任意类型（dict、list、tuple、dataclass 等）|

## v-model

`v-model` 默认绑定属性：`data`

通过 `v-model` 可双向绑定展示的对象，当绑定的响应式数据发生变化时，展示内容自动更新。

```vue
<template>
  <VBox>
    <Pretty v-model="config.value" style="height: 10;" />
    <Button label="添加字段" @click="add_field()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

config = ref({"host": "localhost", "port": 8080})

def add_field():
    config.value = {**config.value, "debug": True, "workers": 4}
</script>
```

## 事件

| 事件 | 说明 |
|------|------|
| — | Pretty 为纯展示组件，无特殊事件 |

## 展示复杂对象示例

```vue
<template>
  <VBox style="height: 1fr;">
    <Label label="请求详情：" />
    <Pretty :data="request_info" style="height: 1fr;" border_title="Request" />
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

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
