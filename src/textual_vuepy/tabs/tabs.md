---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Tabs / Tab 标签导航栏

Tabs 是独立的标签导航栏组件，仅负责渲染可点击的标签，不包含内容区域。通常与 `ContentSwitcher` 配合使用，实现标签导航与内容切换的解耦。

> 底层：[Textual `Tabs`](https://textual.textualize.io/widgets/tabs/)

## 基本用法

Tabs 单独使用时，仅展示标签栏并触发切换事件：

:::textual-vuepy-demo tabs_basic
```vue
<template>
  <VBox style="height: 1fr;">
    <Tabs @tabs_tab_activated="on_tab_change">
      <Tab label="概览" id="overview" />
      <Tab label="详情" id="detail" />
      <Tab label="日志" id="logs" />
    </Tabs>
    <Label :label="`当前选中：${active.value}`" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

active = ref("overview")

def on_tab_change(event):
    active.value = str(event.tab.id)
</script>
```
:::

## Props

### Tabs Props

Tabs 本身没有特有 Props，通过通用属性（`style`、`id` 等）控制外观。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| *(无特有属性)* | — | — | 通过通用属性控制样式 |

### Tab Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `str` | **必填** | 标签显示的文字 |
| `id` | `str` | 自动生成 | 标签唯一标识，用于事件回调和 ContentSwitcher 联动 |

## v-model

- **Tabs** `v-model` 默认绑定属性：`active`（当前激活标签的 ID）
- **Tab** `v-model` 默认绑定属性：`label`（标签文字）

## 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `@tabs_tab_activated` | `Tabs.TabActivated` | 用户激活某个标签时触发；`event.tab` 为被激活的 Tab 对象，`event.tab.id` 为其 ID |
| `@tabs_cleared` | `Tabs.Cleared` | 所有标签被清除时触发 |

## 配合 ContentSwitcher 使用

Tabs 最常见的用法是与 `ContentSwitcher` 配合，实现标签栏与内容区域完全解耦的布局：

:::textual-vuepy-demo tabs_with_switcher
```vue
<template>
  <VBox style="height: 1fr;">
    <Tabs v-model="active_tab.value" @tabs_tab_activated="on_tab_change">
      <Tab label="A 面板" id="a" />
      <Tab label="B 面板" id="b" />
      <Tab label="C 面板" id="c" />
    </Tabs>
    <ContentSwitcher v-model="active_tab.value" style="height: 1fr;">
      <VBox id="a" style="padding: 1;">
        <Label label="这是 A 面板的内容" />
      </VBox>
      <VBox id="b" style="padding: 1;">
        <Label label="这是 B 面板的内容" />
        <Input placeholder="在 B 面板中输入..." />
      </VBox>
      <VBox id="c" style="padding: 1;">
        <Label label="这是 C 面板的内容" />
      </VBox>
    </ContentSwitcher>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

active_tab = ref("a")

def on_tab_change(event):
    active_tab.value = str(event.tab.id)
</script>
```
:::

## 与 TabbedContent 的区别

| 特性 | Tabs + ContentSwitcher | TabbedContent + TabPane |
|------|------------------------|-------------------------|
| 标签栏与内容的关联方式 | 手动绑定，灵活解耦 | 自动管理，开箱即用 |
| 内容区域位置 | 可自由布局，不必紧邻标签栏 | 固定在标签栏下方 |
| 适用场景 | 复杂自定义布局 | 快速构建标准标签页 |

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID，可通过 `#id` 选择器引用 |
| `style` | `str` | TCSS 内联样式，多条规则用分号分隔 |
| `class` | `str` | TCSS 类名，多个类名用空格分隔 |
| `border_title` | `str` | 边框标题（需组件设置了 border 样式才可见）|
| `border_subtitle` | `str` | 边框副标题 |
