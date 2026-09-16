---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# TabbedContent / TabPane 标签页容器

TabbedContent 是一个内置标签导航栏的容器组件，配合 TabPane 子组件可快速构建多标签页界面。用户点击不同标签即可切换显示对应的内容区域。

> 底层：[Textual `TabbedContent`](https://textual.textualize.io/widgets/tabbed_content/)

## 基本用法

:::textual-vuepy-demo tabbed_content_basic
```vue
<template>
  <TabbedContent>
    <TabPane title="首页" id="tab-home">
      <Label label="欢迎来到首页" />
    </TabPane>
    <TabPane title="设置" id="tab-settings">
      <Input placeholder="设置项" />
    </TabPane>
    <TabPane title="关于" id="tab-about">
      <Label label="版本 1.0.0" />
    </TabPane>
  </TabbedContent>
</template>
```
:::

## Props

### TabbedContent Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `initial` | `str` | `""` | 初始激活的 TabPane 的 `id`；留空则激活第一个 TabPane |

### TabPane Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `str` | **必填** | 标签页标题，显示在标签导航栏上 |
| `id` | `str` | 自动生成 | 标签页唯一标识，用于 `initial` 属性或编程式切换 |

## v-model

- **TabbedContent** `v-model` 默认绑定属性：`active`（当前激活标签的 ID）
- **TabPane** `v-model` 默认绑定属性：`label`（标签文字）

通过 `v-model` 可以读取或控制当前激活的标签：

:::textual-vuepy-demo tabbed_content_vmodel
```vue
<template>
  <VBox style="height: 1fr;">
    <Label :label="`当前标签：${active_tab.value}`" />
    <TabbedContent v-model="active_tab.value">
      <TabPane title="A 页" id="pane-a">
        <Label label="A 页内容" />
      </TabPane>
      <TabPane title="B 页" id="pane-b">
        <Label label="B 页内容" />
      </TabPane>
    </TabbedContent>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

active_tab = ref("pane-a")
</script>
```
:::

## 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `@tabbed_content_tab_activated` | `TabbedContent.TabActivated` | 用户切换到新标签时触发；`event.tab` 为被激活的 Tab 对象 |

### 事件使用示例

:::textual-vuepy-demo tabbed_content_events
```vue
<template>
  <TabbedContent
    initial="tab-home"
    @tabbed_content_tab_activated="on_tab_change"
  >
    <TabPane title="首页" id="tab-home">
      <Label label="首页内容" />
    </TabPane>
    <TabPane title="日志" id="tab-log">
      <Label label="日志内容" />
    </TabPane>
  </TabbedContent>
</template>

<script lang="py">
def on_tab_change(event):
    tab_id = str(event.tab.id)
    print(f"切换到标签：{tab_id}")
</script>
```
:::

## 进阶示例

### 动态标签内容

结合响应式数据动态渲染标签页内容：

:::textual-vuepy-demo tabbed_content_dynamic_tabs
```vue
<template>
  <VBox>
  <TabbedContent initial="tab-users">
    <TabPane title="用户列表" id="tab-users">
      <DataTable :rows="users.value" :cols="['name', 'role']" />
    </TabPane>
    <TabPane title="统计" id="tab-stats">
      <Label>共 {{ len(users.value) }} 位用户</Label>
    </TabPane>
  </TabbedContent>
</VBox>
</template>

<script lang="py">
from vuepy import ref

users = ref([
    ("Alice", "admin"),
    ("Bob",   "user"),
])
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
