---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Link 超链接

在终端界面中显示可点击链接的组件，点击后会使用系统默认浏览器打开对应 URL。

> 底层：Textual `Link`

## 基本用法

```vue
<template>
  <VBox>
    <Link url="https://vuepy.org" label="Vue.py 官网" />
    <Link url="https://textual.textualize.io" />
  </VBox>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `url` | `str` | `""` | 链接地址（必填） |
| `label` | `str` | 与 `url` 相同 | 链接显示文字；若不设置则直接显示 `url` 本身 |

## v-model

`v-model` 默认绑定属性：`url`

```vue
<Link v-model="target_url.value" label="点击访问" />
```

## 事件

`Link` 为纯展示交互组件，点击后自动打开浏览器，无自定义事件。

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID |
| `style` | `str` | TCSS 内联样式 |
| `class` | `str` | TCSS 类名（空格分隔）|
| `border_title` | `str` | 边框标题 |
| `border_subtitle` | `str` | 边框副标题 |
