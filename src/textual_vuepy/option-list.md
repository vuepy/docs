---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# OptionList / Option / OptionGroup 选项列表

`OptionList` 是带键盘导航的选项列表，使用 `Option` 定义每个选项，使用 `OptionGroup` 对选项进行分组。

> 底层：[Textual `OptionList`](https://textual.textualize.io/widgets/option_list/)

## 基本用法

```vue
<template>
  <VBox>
    <OptionList ref="ol_ref" @option_list_option_selected="on_select" style="height: 10;">
      <Option prompt="苹果" id="apple" />
      <Option prompt="香蕉" id="banana" />
      <Option prompt="樱桃" id="cherry" />
    </OptionList>
    <Label :label="f'已选: {selected_item.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

ol_ref = ref(None)
selected_item = ref("无")

def on_select(event):
    selected_item.value = str(event.option.prompt)
</script>
```

## Props

### OptionList

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selected` | int | `None` | 初始选中项的索引 |
| `highlighted` | int | `None` | 初始高亮项的索引 |

### Option

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `prompt` | str | — | **必填**，选项显示文字 |
| `id` | str | `None` | 选项唯一 ID，用于通过代码获取选项 |

### OptionGroup

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | str | — | 分组标题文字 |

## v-model

- `OptionList`：`v-model` 默认绑定属性 `selected`，双向绑定当前选中项索引
- `Option`：`v-model` 默认绑定属性 `prompt`
- `OptionGroup`：`v-model` 默认绑定属性 `label`

## 事件

| 事件 | 说明 |
|------|------|
| `@option_list_option_selected` | 选项被 Enter 选中时触发（`OptionList.OptionSelected`），`event.option.prompt` 为选中文字，`event.option_index` 为索引 |
| `@option_list_option_highlighted` | 键盘移动高亮时触发（`OptionList.OptionHighlighted`），`event.option_index` 为当前高亮索引 |

## 分组示例

```vue
<template>
  <VBox style="height: 1fr;">
    <OptionList
      ref="ol_ref"
      @option_list_option_selected="on_select"
      @option_list_option_highlighted="on_highlight"
      style="height: 1fr;"
      border_title="选择编程语言"
    >
      <OptionGroup name="后端语言">
        <Option prompt="🐍 Python"   id="python" />
        <Option prompt="🔷 Go"       id="go" />
        <Option prompt="☕ Java"      id="java" />
      </OptionGroup>
      <OptionGroup name="前端语言">
        <Option prompt="📝 TypeScript" id="ts" />
        <Option prompt="⚡ JavaScript" id="js" />
      </OptionGroup>
    </OptionList>
    <Label :label="f'已选: {selected.value}  |  高亮: {highlighted.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

ol_ref    = ref(None)
selected  = ref("（未选择）")
highlighted = ref("（无）")

def on_select(event):
    selected.value = str(event.option.prompt)

def on_highlight(event):
    highlighted.value = str(event.option.prompt)
</script>
```

## 通过 ref 调用方法

| 方法 | 说明 |
|------|------|
| `.get_option(option_id)` | 通过 ID 获取选项对象 |
| `.get_option_index(option_id)` | 通过 ID 获取选项索引 |
| `.highlighted` | 属性，获取/设置当前高亮索引 |

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
