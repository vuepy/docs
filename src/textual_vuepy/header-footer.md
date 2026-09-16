---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Header / Footer 应用标题栏与状态栏

`Header` 是应用顶部标题栏，显示应用名称、副标题，可选显示时钟；`Footer` 是应用底部状态栏，自动展示当前绑定的键盘快捷键列表。两者通常成对出现，分别置于布局的最顶部和最底部。

> 底层：[Textual `Header`](https://textual.textualize.io/widgets/header/) · [Textual `Footer`](https://textual.textualize.io/widgets/footer/)

## 基本用法

:::textual-vuepy-demo header_footer_basic
```vue
<template>
  <VBox style="height: 1fr;">
    <Header title="My TUI App" subtitle="v1.0.0" />
    <VBox style="height: 1fr;">
      <!-- 主内容区 -->
      <Label label="主内容区域" />
    </VBox>
    <Footer />
  </VBox>
</template>
```
:::

## Props

### Header

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | str | `""` | 应用标题，设置后同步修改 `app.title` |
| `subtitle` | str | `""` | 应用副标题，设置后同步修改 `app.subtitle` |
| `show_clock` | bool | `False` | 是否在标题栏右侧显示当前时间 |

### Footer

Footer 没有特殊 Props，自动读取应用中注册的键盘绑定（`Binding`）并展示在底部。

## v-model

- `Header`：无 `v-model`
- `Footer`：无 `v-model`

## 事件

| 事件 | 说明 |
|------|------|
| — | Header 和 Footer 均无特殊事件 |

## 带时钟的完整应用布局

:::textual-vuepy-demo header_footer_with_clock
```vue
<template>
  <VBox style="height: 1fr;">
    <Header title="监控面板" subtitle="实时数据" :show_clock="True" />
    <HBox style="height: 1fr;">
      <!-- 左侧导航 -->
      <VBox style="width: 20; border-right: solid $panel;">
        <ListView style="height: 1fr;">
          <ListItem><Label label="📊 总览" /></ListItem>
          <ListItem><Label label="📈 图表" /></ListItem>
          <ListItem><Label label="⚙️ 设置" /></ListItem>
        </ListView>
      </VBox>
      <!-- 主内容区 -->
      <VBox style="height: 1fr; padding: 1 2;">
        <Label label="欢迎使用监控面板" style="text-style: bold;" />
        <Label label="从左侧导航栏选择功能。" />
      </VBox>
    </HBox>
    <Footer />
  </VBox>
</template>
```
:::

## 动态修改标题示例

:::textual-vuepy-demo header_footer_dynamic_title
```vue
<template>
  <VBox style="height: 1fr;">
    <Header :title="app_title.value" :subtitle="app_subtitle.value" />
    <VBox style="height: 1fr; align: center middle;">
      <Label label="点击按钮切换标题" />
      <Button label="切换标题" @click="toggle_title()" />
    </VBox>
    <Footer />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

app_title    = ref("My App")
app_subtitle = ref("就绪")

pages = [
    ("主页", "欢迎"),
    ("设置", "配置中"),
    ("关于", "v1.0.0"),
]
page_idx = ref(0)

def toggle_title():
    page_idx.value = (page_idx.value + 1) % len(pages)
    t, s = pages[page_idx.value]
    app_title.value    = t
    app_subtitle.value = s
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
