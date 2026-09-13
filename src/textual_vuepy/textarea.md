---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# TextArea 多行文本编辑器

功能强大的多行文本编辑组件，支持语法高亮、代码编辑器模式、只读模式等，适合构建代码编辑器、日志查看器等场景。

> 底层：[Textual `TextArea`](https://textual.textualize.io/widgets/text_area/)

## 基本用法

```vue
<template>
  <TextArea
    v-model="code.value"
    language="python"
    code_editor
    style="height: 1fr;"
  />
</template>

<script lang="py">
from vuepy import ref

code = ref("""def hello():
    print("Hello, World!")
""")
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | `str` | `""` | 文本内容 |
| `language` | `str` | `None` | 语法高亮语言，如 `"python"`、`"json"`、`"markdown"` 等 |
| `code_editor` | `bool` | `False` | 代码编辑器模式（显示行号 + 启用语法高亮，无需传值，存在即为 `True`）|
| `read_only` | `bool` | `False` | 只读模式，用户无法编辑内容 |
| `theme` | `str` | `"monokai"` | 语法高亮主题名称 |
| `tab_behavior` | `str` | `"focus"` | Tab 键行为：`"focus"` 切换焦点 \| `"indent"` 插入缩进 |

## v-model

`v-model` 默认绑定属性：`text`

```vue
<TextArea v-model="content.value" />
```

## 事件

| 事件 | 说明 |
|------|------|
| `text_area_changed` | 文本内容改变时触发（对应 Textual `TextArea.Changed`）|

## 通过 ref 访问

通过 `ref` 获取底层 widget 实例后，可访问以下属性：

| 属性 / 方法 | 说明 |
|------------|------|
| `.selected_text` | 当前选中的文本内容 |
| `.selection` | 当前选区范围（`Selection` 对象）|
| `.cursor_location` | 光标位置 `(行, 列)` |

```vue
<template>
  <VBox>
    <TextArea ref="editor_ref" v-model="code.value" language="python" code_editor />
    <Button label="获取选中文字" @click="get_selected()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

editor_ref = ref(None)
code = ref("# 在此输入代码\n")

def get_selected():
    if editor_ref.value:
        widget = editor_ref.value.unwrap()
        print(f"选中内容: {widget.selected_text}")
</script>
```

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `str` | 组件 CSS ID |
| `style` | `str` | TCSS 内联样式 |
| `class` | `str` | TCSS 类名（空格分隔）|
| `border_title` | `str` | 边框标题 |
| `border_subtitle` | `str` | 边框副标题 |
