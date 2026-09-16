---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# ProgressBar 进度条

ProgressBar 显示任务的完成进度，支持百分比、预计剩余时间（ETA）等信息展示，适合文件下载、数据处理等长时任务的进度反馈。

> 底层：[Textual `ProgressBar`](https://textual.textualize.io/widgets/progress_bar/)

## 基本用法

:::textual-vuepy-demo progress_bar_basic
```vue
<template>
  <VBox>
    <ProgressBar ref="pb_ref" :progress="progress.value" :total="100" style="height: 3;" />
    <HBox style="height: 3;">
      <Button label="+10%" @click="advance()" />
      <Button label="重置" @click="reset()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

pb_ref = ref(None)
progress = ref(0)

def advance():
    progress.value = min(100, progress.value + 10)

def reset():
    progress.value = 0
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `progress` | float | `0` | 当前进度值 |
| `total` | float | `100` | 总进度值（100% 对应的值）|
| `show_eta` | bool | `True` | 是否显示预计剩余时间（ETA）|
| `show_percentage` | bool | `True` | 是否显示百分比文字 |
| `show_bar` | bool | `True` | 是否显示进度条图形 |

## v-model

`v-model` 默认绑定属性：`progress`

通过 `v-model` 可双向绑定当前进度值，响应式更新后进度条自动刷新。

:::textual-vuepy-demo progress_bar_vmodel
```vue
<template>
  <VBox>
    <ProgressBar v-model="progress.value" :total="total_steps" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

progress    = ref(0)
total_steps = 200
</script>
```
:::

## 事件

| 事件 | 说明 |
|------|------|
| — | ProgressBar 为展示组件，无特殊事件 |

## 通过 ref 调用方法

| 方法 | 说明 |
|------|------|
| `.advance(amount)` | 在当前进度基础上增加 `amount` |
| `.update(progress=x, total=y)` | 直接设置当前进度值和/或总值 |

## 模拟下载进度示例

:::textual-vuepy-demo progress_bar_download
```vue
<template>
  <VBox style="height: 1fr;">
    <ProgressBar
      ref="pb_ref"
      :progress="dl_progress.value"
      :total="100"
      :show_eta="True"
      style="height: 3;"
      border_title="下载进度"
    />
    <Label :label="status.value" />
    <HBox style="height: 3;">
      <Button label="开始下载" @click="start_download()" />
      <Button label="重置" @click="reset()" variant="warning" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

pb_ref      = ref(None)
dl_progress = ref(0)
status      = ref("就绪")

def tick():
    if dl_progress.value < 100:
        dl_progress.value = min(100, dl_progress.value + 5)
        status.value = f"下载中... {dl_progress.value}%"
        app.tt_app.set_timer(0.2, tick)
    else:
        status.value = "✅ 下载完成！"

def start_download():
    dl_progress.value = 0
    status.value = "开始下载..."
    tick()

def reset():
    dl_progress.value = 0
    status.value = "就绪"
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
