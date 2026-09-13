---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# LoadingIndicator 加载动画指示器

LoadingIndicator 显示一个全屏或容器内的旋转加载动画，在数据加载、异步操作等场景下向用户反馈"正在处理"的状态。通常配合 `v-if` 或 `v-show` 控制显示时机。

> 底层：[Textual `LoadingIndicator`](https://textual.textualize.io/widgets/loading_indicator/)

## 基本用法

```vue
<template>
  <VBox style="height: 1fr;">
    <LoadingIndicator v-if="is_loading.value" />
    <VBox v-else style="height: 1fr;">
      <Label label="内容已加载完成！" />
    </VBox>
    <Button label="模拟加载" @click="simulate_load()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

is_loading = ref(False)

def simulate_load():
    is_loading.value = True
    def done():
        is_loading.value = False
    app.tt_app.set_timer(2, done)
</script>
```

## Props

LoadingIndicator 除通用属性外无特殊 Props，仅需通过 `v-if` / `v-show` 控制其显示状态。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| — | — | — | 无特殊 Props（通过 `v-if`/`v-show` 控制显示）|

## v-model

`v-model` 默认绑定属性：`show`

通过 `v-model` 直接控制加载指示器的显示状态。

```vue
<template>
  <VBox style="height: 1fr;">
    <LoadingIndicator v-model="loading.value" />
    <Button label="切换" @click="loading.value = not loading.value" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
loading = ref(False)
</script>
```

## 事件

| 事件 | 说明 |
|------|------|
| — | LoadingIndicator 为纯展示组件，无特殊事件 |

## 覆盖内容区示例

将 `LoadingIndicator` 与内容区同时渲染，使用绝对定位覆盖效果：

```vue
<template>
  <VBox style="height: 1fr;">
    <!-- 数据加载中覆盖整个内容区 -->
    <LoadingIndicator v-if="loading.value" style="height: 1fr;" />
    <VBox v-else style="height: 1fr;" border_title="数据列表">
      <DataTable :cols="['ID', '名称', '状态']" :rows="data_rows.value" style="height: 1fr;" />
    </VBox>
    <HBox style="height: 3;">
      <Button label="刷新数据" @click="reload()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

loading   = ref(False)
data_rows = ref([
    ("001", "任务 A", "完成"),
    ("002", "任务 B", "进行中"),
    ("003", "任务 C", "待开始"),
])

def reload():
    loading.value = True

    def on_done():
        # 模拟从后端获取新数据
        data_rows.value = [
            ("001", "任务 A", "完成"),
            ("002", "任务 B", "完成"),
            ("003", "任务 C", "进行中"),
            ("004", "任务 D", "待开始"),
        ]
        loading.value = False

    app.tt_app.set_timer(1.5, on_done)
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
