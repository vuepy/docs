---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Welcome Textual 欢迎页面

Welcome 是 Textual 框架内置的欢迎/介绍页面组件，展示 Textual 的基本信息和快捷键说明，适合作为应用的初始欢迎屏或帮助页面使用。

> 底层：[Textual `Welcome`](https://textual.textualize.io/widgets/welcome/)

## 基本用法

:::textual-vuepy-demo welcome_basic
```vue
<template>
  <Welcome style="height: 1fr;" />
</template>
```
:::

## Props

Welcome 无特殊 Props，除通用属性外无需额外配置。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| — | — | — | 无特殊 Props |

## v-model

Welcome 无 `v-model`。

## 事件

| 事件 | 说明 |
|------|------|
| — | Welcome 为纯展示组件，无特殊事件 |

## 嵌入标签页示例

将 Welcome 作为"帮助"或"关于"标签页的内容：

:::textual-vuepy-demo welcome_in_tabs
```vue
<template>
  <VBox style="height: 1fr;">
    <Header title="My App" subtitle="v1.0.0" />
    <TabbedContent style="height: 1fr;">
      <TabPane title="主页" id="home">
        <VBox style="height: 1fr; align: center middle;">
          <Label label="👋 欢迎使用 My App！" style="text-style: bold;" />
        </VBox>
      </TabPane>
      <TabPane title="帮助" id="help">
        <Welcome style="height: 1fr;" />
      </TabPane>
    </TabbedContent>
    <Footer />
  </VBox>
</template>
```
:::

## 条件显示示例

首次启动时展示欢迎页，用户确认后进入主界面：

:::textual-vuepy-demo welcome_conditional
```vue
<template>
  <VBox style="height: 1fr;">
    <Welcome v-if="show_welcome.value" style="height: 1fr;" />
    <VBox v-else style="height: 1fr; align: center middle;">
      <Label label="主界面内容" style="text-style: bold;" />
    </VBox>
    <HBox style="height: 3;" v-if="show_welcome.value">
      <Button label="开始使用" @click="dismiss()" variant="success" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

show_welcome = ref(True)

def dismiss():
    show_welcome.value = False
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
