---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# ContentSwitcher 内容切换器

ContentSwitcher 根据子组件的 `id` 切换显示哪个子组件，同一时刻只有一个子组件可见。通常与 `Tabs` 或按钮配合使用，实现手动控制内容区域的显示切换。

> 底层：[Textual `ContentSwitcher`](https://textual.textualize.io/widgets/content_switcher/)

## 基本用法

通过按钮点击切换 ContentSwitcher 中显示的内容面板：

:::textual-vuepy-demo content_switcher_basic
```vue
<template>
  <VBox style="height: 1fr;">
    <HBox style="height: 3;">
      <Button label="显示 A" @click="show('panel-a')" />
      <Button label="显示 B" @click="show('panel-b')" />
    </HBox>
    <ContentSwitcher ref="switcher_ref" initial="panel-a" style="height: 1fr;">
      <VBox id="panel-a" style="padding: 1;">
        <Label label="面板 A 的内容" />
      </VBox>
      <VBox id="panel-b" style="padding: 1;">
        <Label label="面板 B 的内容" />
      </VBox>
    </ContentSwitcher>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

switcher_ref = ref(None)

def show(panel: str):
    switcher_ref.value.unwrap().current = panel
</script>
```
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `initial` | `str \| None` | `None` | 初始显示的子组件 `id`；不传则初始不显示任何子组件 |

所有参与切换的子组件都需要唯一的 `id`；没有 `id` 的子组件会被隐藏并忽略。

## v-model

`v-model` 默认绑定属性：`current`（当前显示的子组件 ID，类型为 `str \| None`）

通过 `v-model` 可读取或设置当前显示的子组件 ID：

:::textual-vuepy-demo content_switcher_vmodel
```vue
<template>
  <VBox style="height: 1fr;">
    <HBox style="height: 3;">
      <Button label="首页" @click="show('home')" />
      <Button label="设置" @click="show('settings')" />
    </HBox>
    <Label>当前面板：{{ current_panel.value }}</Label>
    <ContentSwitcher v-model="current_panel.value" ref='cs_ref' style="height: 1fr;">
      <VBox id="home"><Label label="首页" /></VBox>
      <VBox id="settings"><Label label="设置" /></VBox>
    </ContentSwitcher>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

current_panel = ref("settings")
cs_ref = ref(None)

def show(panel: str):
    cs_ref.value.unwrap().current = panel

</script>
```
:::

## 事件

无

## 配合 Tabs 使用

ContentSwitcher 与 Tabs 配合是构建自定义标签页布局的推荐方式，详见 [Tabs 文档](./tabs)。

:::textual-vuepy-demo content_switcher_with_tabs
```vue
<template>
  <VBox style="height: 1fr;">
    <Tabs @tabs_tab_activated="on_tab_change">
      <Tab label="仪表盘" id="dashboard" />
      <Tab label="配置" id="config" />
    </Tabs>
    <ContentSwitcher v-model="active.value" style="height: 1fr;">
      <VBox id="dashboard" style="padding: 1;">
        <Label label="仪表盘内容" />
      </VBox>
      <VBox id="config" style="padding: 1;">
        <Label label="配置内容" />
        <Input placeholder="配置项..." />
      </VBox>
    </ContentSwitcher>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

active = ref("dashboard")

def on_tab_change(event):
    active.value = str(event.tab.id)
</script>
```
:::

## 编程式切换

通过 `ref` 获取组件实例后，可直接设置 `.current` 属性切换内容：

:::textual-vuepy-demo content_switcher_programmatic
```vue
<template>
  <VBox style="height: 1fr;">
    <HBox style="height: 3;">
      <Button label="← 上一个" @click="prev()" />
      <Button label="下一个 →" @click="next()" />
    </HBox>
    <ContentSwitcher ref="sw" initial="s1" style="height: 1fr;">
      <VBox id="s1"><Label label="第 1 步" /></VBox>
      <VBox id="s2"><Label label="第 2 步" /></VBox>
      <VBox id="s3"><Label label="第 3 步" /></VBox>
    </ContentSwitcher>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

sw = ref(None)
steps = ["s1", "s2", "s3"]
current_index = ref(0)

def prev():
    current_index.value = max(0, current_index.value - 1)
    sw.value.unwrap().current = steps[current_index.value]

def next():
    current_index.value = min(len(steps) - 1, current_index.value + 1)
    sw.value.unwrap().current = steps[current_index.value]
</script>
```
:::

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID，可通过 `#id` 选择器引用 |
| `style` | `str` | TCSS 内联样式，多条规则用分号分隔 |
| `class` | `str` | TCSS 类名，多个类名用空格分隔 |
| `border_title` | `str` | 边框标题（需组件设置了 border 样式才可见）|
| `border_subtitle` | `str` | 边框副标题 |
