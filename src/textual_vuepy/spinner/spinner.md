---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Spinner 旋转加载器

Spinner 是内置的 SFC 自定义组件，以 Braille 点阵风格的旋转动画配合文字，向用户展示"正在处理"状态。相比 `LoadingIndicator`，Spinner 更轻量，可嵌入任意位置而不占满整个区域。

> 来源：内置 SFC 组件（`textual_vuepy/components/Spinner.vue`），通过 `vtextual` 插件自动注册，无需手动导入。

## 基本用法

:::textual-vuepy-demo spinner_basic
```vue
<template>
  <VBox>
    <Spinner text="处理中，请稍候..." :running="processing.value" />
    <Button label="开始处理" @click="start()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

processing = ref(False)

def start():
    processing.value = True
    def done():
        processing.value = False
    app.tt_app.set_timer(3, done)
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | str | `"Loading..."` | 旋转符号右侧显示的提示文字 |
| `interval` | float | `0.1` | 动画每帧间隔，单位秒，越小旋转越快 |
| `running` | bool | `False` | 是否运行动画；`False` 时组件静止（不显示），`True` 时启动旋转 |
| `style` | str | `""` | TCSS 样式字符串，覆盖组件默认样式 |

> **旋转字符序列**：`⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏`（Braille 点阵风格）

## v-model

Spinner 无 `v-model`。通过 `:running` prop 控制动画启停，通过 `:text` prop 动态更新提示文字。

## 事件

| 事件 | 说明 |
|------|------|
| — | 无特殊事件 |

## 多步骤进度示例

:::textual-vuepy-demo spinner_multistep
```vue
<template>
  <VBox style="height: 1fr;">
    <Spinner :text="step_text.value" :running="running.value" style="height: 3;" />
    <ProgressBar :progress="progress.value" :total="3" :show_eta="False" style="height: 3;" />
    <Label :label="f'步骤 {progress.value}/3'" />
    <Button label="开始任务" @click="run_task()" :disabled="running.value" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

running   = ref(False)
progress  = ref(0)
step_text = ref("就绪")

steps = [
    "初始化环境...",
    "下载依赖包...",
    "构建项目...",
]

def run_task():
    running.value  = True
    progress.value = 0

    def step(idx):
        if idx < len(steps):
            step_text.value  = steps[idx]
            progress.value   = idx + 1
            app.tt_app.set_timer(1.5, lambda: step(idx + 1))
        else:
            running.value  = False
            step_text.value = "✅ 任务完成！"

    step(0)
</script>
```
:::

## 与 ShimmerText 对比

| 特性 | Spinner | ShimmerText |
|------|:---:|:---:|
| 动画类型 | 旋转符号 | 文字流光高亮 |
| 占用空间 | 单行（紧凑）| 单行 |
| 适用场景 | 通用加载提示 | AI 生成、等待场景 |
| 文字动态 | 静态文字 + 旋转符 | 整段文字动态高亮 |

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
