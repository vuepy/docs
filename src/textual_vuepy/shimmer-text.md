---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# ShimmerText 流光文字动画

ShimmerText 是内置的 SFC 自定义组件，以动画效果逐字高亮文字，产生"流光"视觉效果。适合用于 AI 生成中、数据加载中等等待场景，提升交互体验。

> 来源：内置 SFC 组件（`textual_vuepy/components/ShimmerText.vue`），通过 `vtextual` 插件自动注册，无需手动导入。

## 基本用法

```vue
<template>
  <VBox>
    <ShimmerText text="AI 正在思考..." :running="is_loading.value" />
    <HBox>
      <Button label="开始" @click="is_loading.value = True" />
      <Button label="停止" @click="is_loading.value = False" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

is_loading = ref(False)
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | str | `"Thinking"` | 要展示的文字内容 |
| `highlight_width` | int | `3` | 同时高亮的字符数（光晕宽度）|
| `interval` | float | `0.1` | 动画每帧间隔，单位秒，越小动画越快 |
| `running` | bool | `False` | 是否运行动画；`False` 时文字静止显示，`True` 时启动流光效果 |

## v-model

ShimmerText 无 `v-model`。通过 `:running` prop 控制动画状态，通过 `:text` prop 控制显示文字。

## 事件

| 事件 | 说明 |
|------|------|
| — | 无特殊事件 |

## 配合 AI 请求使用

```vue
<template>
  <VBox style="height: 1fr;">
    <ShimmerText
      text="AI 正在生成回答，请稍候..."
      :highlight_width="5"
      :interval="0.08"
      :running="generating.value"
      style="height: 3;"
    />
    <RichLog ref="output_log" markup highlight style="height: 1fr;" border_title="AI 输出" />
    <HBox style="height: 3;">
      <Input v-model="user_input.value" placeholder="输入问题..." style="width: 1fr;" />
      <Button label="发送" @click="send()" :disabled="generating.value" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

generating  = ref(False)
user_input  = ref("")
output_log  = ref(None)

def send():
    if not user_input.value.strip():
        return
    generating.value = True
    question = user_input.value
    user_input.value = ""

    def on_response():
        output_log.value.unwrap().write(
            f"[bold cyan]Q:[/bold cyan] {question}\n"
            f"[bold green]A:[/bold green] 这是一个模拟的 AI 回答。\n"
        )
        generating.value = False

    # 模拟 AI 请求延迟
    app.tt_app.set_timer(2, on_response)
</script>
```

## 自定义样式示例

```vue
<template>
  <VBox style="height: 1fr; align: center middle;">
    <ShimmerText
      text="Loading System..."
      :highlight_width="4"
      :interval="0.05"
      :running="True"
      style="height: 3; text-style: bold;"
    />
  </VBox>
</template>
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
