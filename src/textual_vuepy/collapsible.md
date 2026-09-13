---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Collapsible 可折叠容器

Collapsible 是一个可以展开或收起内容区域的容器组件，适合用于侧边栏、设置面板、详情展示等场景。点击标题栏可切换折叠状态。

> 底层：[Textual `Collapsible`](https://textual.textualize.io/widgets/collapsible/)

## 基本用法

```vue
<template>
  <Collapsible title="详细信息" v-model="is_collapsed.value">
    <Label label="折叠内容在这里" />
    <Input placeholder="输入内容" />
  </Collapsible>
</template>

<script lang="py">
from vuepy import ref

is_collapsed = ref(False)
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `str` | `""` | 标题栏文字，点击可触发折叠/展开 |
| `collapsed` | `bool` | `False` | 是否处于折叠状态；`True` 表示折叠（隐藏内容），`False` 表示展开 |

## v-model

`v-model` 默认绑定属性：`collapsed`

`v-model` 绑定的值为 `bool` 类型，`True` 表示折叠，`False` 表示展开。

```vue
<template>
  <VBox>
    <Button label="切换折叠" @click="toggle()" />
    <Collapsible title="内容区域" v-model="collapsed.value">
      <Label label="可折叠的内容" />
    </Collapsible>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

collapsed = ref(False)

def toggle():
    collapsed.value = not collapsed.value
</script>
```

## 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `@collapsible_collapsed` | `Collapsible.Collapsed` | 容器被折叠（内容隐藏）时触发 |
| `@collapsible_expanded` | `Collapsible.Expanded` | 容器被展开（内容显示）时触发 |

### 事件使用示例

```vue
<template>
  <Collapsible
    title="可观察的折叠区域"
    v-model="is_collapsed.value"
    @collapsible_collapsed="on_collapsed"
    @collapsible_expanded="on_expanded"
  >
    <Label label="内容" />
  </Collapsible>
</template>

<script lang="py">
from vuepy import ref

is_collapsed = ref(False)

def on_collapsed(event):
    print("已折叠")

def on_expanded(event):
    print("已展开")
</script>
```

## 嵌套使用

Collapsible 支持多层嵌套，适合构建树形折叠菜单：

```vue
<template>
  <VBox style="height: 1fr; padding: 1;">
    <Collapsible title="一级菜单 A">
      <Label label="菜单项 A-1" />
      <Collapsible title="二级菜单 A-2">
        <Label label="菜单项 A-2-1" />
        <Label label="菜单项 A-2-2" />
      </Collapsible>
    </Collapsible>
    <Collapsible title="一级菜单 B" :collapsed="True">
      <Label label="默认折叠的内容" />
    </Collapsible>
  </VBox>
</template>
```

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID，可通过 `#id` 选择器引用 |
| `style` | `str` | TCSS 内联样式，多条规则用分号分隔 |
| `class` | `str` | TCSS 类名，多个类名用空格分隔 |
| `border_title` | `str` | 边框标题（需组件设置了 border 样式才可见）|
| `border_subtitle` | `str` | 边框副标题 |
