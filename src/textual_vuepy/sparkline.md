---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Sparkline 迷你折线图

Sparkline 在终端中渲染一条迷你折线图，用于直观展示数值序列的趋势变化，常用于监控仪表盘、实时数据可视化等场景。

> 底层：[Textual `Sparkline`](https://textual.textualize.io/widgets/sparkline/)

## 基本用法

```vue
<template>
  <VBox>
    <Label label="CPU 使用率趋势：" />
    <Sparkline :data="cpu_history.value" :summary_function="max" style="height: 3;" />
    <Button label="更新数据" @click="update()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import random

cpu_history = ref([random.uniform(0, 100) for _ in range(20)])

def update():
    new_data = cpu_history.value[1:] + [random.uniform(0, 100)]
    cpu_history.value = new_data
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | list[float] | `[]` | 数据点列表，每个元素为一个浮点数 |
| `summary_function` | callable | `max` | 用于在右侧汇总显示的函数，如 `max`、`min`、`sum`、`statistics.mean` |

## v-model

`v-model` 默认绑定属性：`data`

通过 `v-model` 可双向绑定数据列表，响应式更新后折线图自动重绘。

```vue
<template>
  <VBox>
    <Sparkline v-model="metrics.value" style="height: 3;" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

metrics = ref([10, 25, 30, 15, 40, 55, 20, 60, 45, 30])
</script>
```

## 事件

| 事件 | 说明 |
|------|------|
| — | Sparkline 为纯展示组件，无特殊事件 |

## 实时监控示例

```vue
<template>
  <VBox style="height: 1fr;">
    <Label label="网络流量（最近 30 秒）" />
    <Sparkline
      :data="net_in.value"
      :summary_function="max"
      style="height: 3;"
      border_title="入站 KB/s"
    />
    <Sparkline
      :data="net_out.value"
      :summary_function="max"
      style="height: 3;"
      border_title="出站 KB/s"
    />
    <Button label="模拟刷新" @click="tick()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import random

net_in  = ref([random.uniform(0, 500) for _ in range(30)])
net_out = ref([random.uniform(0, 200) for _ in range(30)])

def tick():
    net_in.value  = net_in.value[1:]  + [random.uniform(0, 500)]
    net_out.value = net_out.value[1:] + [random.uniform(0, 200)]
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
