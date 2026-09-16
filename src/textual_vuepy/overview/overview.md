---
title: Textual-vuepy 组件总览
footer: false
---

# Textual-vuepy 组件总览 {#overview}

Textual-vuepy 将 [Textual](https://textual.textualize.io/) 全部内置 Widget 封装为 Vue.py 组件，让你在 `.vue` SFC 文件中以声明式方式构建终端 TUI 应用。

> 安装：`pip install 'vuepy-core[textual]'`
>
> 导入：在 `create_app` 时指定 `backend='textual'`，vtextual 插件将自动注册所有组件。

---

## 布局组件 {#layout}

| 组件 | 说明 | 常用属性 |
|------|------|---------|
| `VBox` | 垂直容器，子组件从上到下排列 | `style`, `id` |
| `HBox` | 水平容器，子组件从左到右排列 | `style`, `id` |
| `Slot` | `VBox` 的别名，用于 slot 占位 | — |
| `Collapsible` | 可折叠容器 | `title`, `collapsed` |
| `TabbedContent` | 标签页容器（配合 `TabPane`）| `initial` |
| `TabPane` | 标签页内容区域 | `title`, `id` |
| `ContentSwitcher` | 根据 ID 切换显示内容 | `initial` |

:::textual-vuepy-demo overview_layout
```vue
<template>
  <VBox style="height: 1fr;">
    <HBox id="toolbar">
      <Button label="Action" @click="on_action()" />
    </HBox>
    <VBox id="content" style="height: 1fr;">
      <!-- 内容 -->
    </VBox>
  </VBox>
</template>
```
:::

---

## 基础组件 {#basic}

| 组件 | v-model 默认绑定 | 说明 | 常用属性 |
|------|:---------------:|------|---------|
| `Button` | `label` | 按钮 | `label`, `disabled`, `variant` |
| `Label` | `label` | 文本标签，支持 Rich markup | `label` |
| `Static` | `renderable` | 静态文本/Rich 渲染 | `renderable`, `markup` |
| `Link` | `url` | 超链接 | `url`, `label` |
| `Placeholder` | — | 占位符 | `label` |

:::textual-vuepy-demo overview_basic
```vue
<template>
  <VBox>
    <Label label="[bold green]Hello[/bold green]" />
    <Button label="点击我" variant="primary" @click="on_click()" />
  </VBox>
</template>
```
:::

---

## 表单组件 {#form}

| 组件 | v-model 默认绑定 | 说明 | 常用属性 |
|------|:---------------:|------|---------|
| `Input` | `value` | 单行输入框 | `value`, `placeholder`, `password`, `disabled`, `compact` |
| `TextArea` | `text` | 多行文本编辑器 | `text`, `language`, `code_editor` |
| `MaskedInput` | `value` | 格式化输入框（掩码）| `template`, `value` |
| `Checkbox` | `value` | 复选框 | `label`, `value`, `disabled` |
| `RadioButton` | `value` | 单选按钮 | `label`, `value` |
| `RadioSet` | `pressed` | 单选按钮组 | — |
| `Select` | `value` | 下拉选择框 | `options`, `value`, `prompt` |
| `SelectionList` | `selected` | 多选列表 | — |
| `Switch` | `value` | 开关 | `value`, `animate` |

:::textual-vuepy-demo overview_form
```vue
<template>
  <VBox>
    <Input v-model="name.value" placeholder="请输入姓名" />
    <Select v-model="lang.value"
            :options="[('Python', 'py'), ('TypeScript', 'ts')]" />
    <Switch v-model="enabled.value" />
    <Checkbox label="同意条款" v-model="agreed.value" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

name = ref("")
lang = ref("py")
enabled = ref(True)
agreed = ref(False)
</script>
```
:::

---

## 数据展示 {#data}

| 组件 | v-model 默认绑定 | 说明 | 常用属性 |
|------|:---------------:|------|---------|
| `DataTable` | `data` | 数据表格 | `cols`, `rows` |
| `Markdown` | `markdown` | Markdown 渲染 | `markdown` |
| `MarkdownViewer` | `markdown` | Markdown 查看器（含目录）| `markdown`, `show_table_of_contents` |
| `Pretty` | `object` | Python 对象格式化展示 | `object` |
| `Sparkline` | `data` | 迷你折线图 | `data`, `summary_function` |
| `Digits` | `value` | 大号数字显示（类 LCD）| `value` |
| `RichLog` | `lines` | 富文本滚动日志 | `markup`, `wrap`, `highlight` |
| `Log` | `lines` | 纯文本滚动日志 | — |

:::textual-vuepy-demo overview_data
```vue
<template>
  <VBox style="height: 1fr;">
    <RichLog ref="log_ref" highlight markup style="height: 1fr;" />
    <Button label="写入日志" @click="write_log()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref, onMounted

log_ref = ref(None)

def write_log():
    log_ref.value.unwrap().write("[bold cyan]事件发生[/bold cyan]")
</script>
```
:::

---

## 导航组件 {#navigation}

| 组件 | 说明 | 常用属性 |
|------|------|---------|
| `Tabs` | 顶部标签页导航 | `active` |
| `Tab` | 单个标签（在 `Tabs` 内使用）| `label`, `id` |
| `ListView` | 可滚动列表视图 | `initial_index` |
| `ListItem` | 列表项（在 `ListView` 内使用）| — |
| `OptionList` | 可选项列表 | — |
| `Option` | 选项项（在 `OptionList` 内使用）| `prompt`, `id` |
| `SelectionList` | 多选列表 | — |
| `Selection` | 多选项（在 `SelectionList` 内使用）| `prompt`, `value` |
| `Tree` | 树形结构 | `label` |
| `DirectoryTree` | 目录树 | `path` |

---

## 反馈组件 {#feedback}

| 组件 | 说明 | 常用属性 / 方法 |
|------|------|----------------|
| `Dialog` | 模态对话框 | `ref` 调用 `.open()` / `.close()`，或 `v-model:value` |
| `LoadingIndicator` | 加载动画指示器 | — |
| `ProgressBar` | 进度条 | `progress`, `total`, `show_eta` |
| `Tooltip` | 工具提示 | `message` |

:::textual-vuepy-demo overview_feedback
```vue
<template>
  <VBox>
    <Button label="打开对话框" @click="dialog_ref.value.unwrap().open()" />
    <Dialog ref="dialog_ref">
      <Label label="这是对话框内容" />
      <template #footer>
        <Button label="关闭" @click="dialog_ref.value.unwrap().close()" />
      </template>
    </Dialog>
    <ProgressBar :progress="progress.value" :total="100" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

dialog_ref = ref(None)
progress = ref(0)
</script>
```
:::

---

## 结构/布局辅助 {#structure}

| 组件 | 说明 |
|------|------|
| `Header` | 应用顶部标题栏 |
| `Footer` | 应用底部状态栏（显示快捷键）|
| `HelpPanel` | 侧边帮助面板 |
| `KeyPanel` | 按键面板（显示已注册的快捷键）|
| `Rule` | 水平分隔线 |
| `Welcome` | 欢迎页面 |
| `Display` | 直接显示已有的 Textual Widget 实例 |

---

## 自定义 SFC 组件 {#custom-sfc-components}

Textual-vuepy 提供两个开箱即用的 SFC 自定义组件（位于 `textual_vuepy/components/`）：

### ShimmerText — 闪光文字

显示带有流光高亮动画的文字（适合 AI 思考状态展示）。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | str | `"Thinking"` | 显示的文字 |
| `highlight_width` | int | `3` | 高亮区域宽度（字符数）|
| `interval` | float | `0.1` | 动画帧间隔（秒）|
| `running` | bool | `False` | 是否运行动画 |

:::textual-vuepy-demo overview_shimmer_text
```vue
<template>
  <ShimmerText text="AI 正在思考..." :running="is_loading.value" />
</template>

<script lang="py">
from vuepy import ref
from vuepy import import_sfc
from pathlib import Path
from textual_vuepy.comps import ShimmerText

is_loading = ref(True)
</script>
```
:::

### Spinner — 加载旋转器

显示带旋转字符动画的加载指示器。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | str | `"Loading..."` | 旋转符号后的文字 |
| `interval` | float | `0.1` | 动画帧间隔（秒）|
| `running` | bool | `False` | 是否运行动画 |
| `style` | str | `""` | TCSS 样式字符串 |

---

## 内置应用（VuepyAppStore）{#builtin-apps}

安装 `textual_vuepy` 后自动注册以下应用，可通过 `vuepy run <name>` 启动：

| 名称 | 说明 |
|------|------|
| `playground` | 交互式 SFC 编辑器 + 实时预览，支持拖拽分隔条、文件热重载、目录树 |
| `keys` | 按键事件查看器，显示每次按键的 `Key` 事件详情 |

```sh
vuepy run playground  # 启动 SFC Playground
vuepy run keys        # 启动按键查看器
```

---

## VueUse 组合式函数 {#vueuse}

从 `textual_vuepy.vueuse` 导入：

| 函数 | 说明 | 返回值 |
|------|------|--------|
| `onKeyStroke(key, cb)` | 注册全局按键监听（在 `onMounted` 后生效），`cb` 不接收参数 | — |
| `useMouse()` | 追踪鼠标屏幕坐标 | `(x: Ref[int], y: Ref[int])` |

:::textual-vuepy-demo overview_vueuse
```vue
<script lang="py">
from textual_vuepy.vueuse import onKeyStroke, useMouse

# 全局按键监听
def handle_quit():
    app.tt_app.exit()

onKeyStroke('ctrl+t', handle_quit)

# 鼠标坐标追踪
mouse_x, mouse_y = useMouse()
</script>

<template>
  <Label :label="f'鼠标位置: ({mouse_x.value}, {mouse_y.value})'" />
</template>
```
:::

`onKeyStroke` 通过 Textual 的 binding 实现，因此被 Textual 自己占用的按键监听不到：`ctrl+c` 会弹出
"Press ctrl+q to quit" 提示，`ctrl+q` 直接退出应用，`ctrl+p` 打开命令面板。挑一个未被占用的键即可。

---

## 事件处理 {#events}

Textual-vuepy 支持 Textual 原生事件，通过 `@事件名` 绑定：

:::textual-vuepy-demo overview_event_handling
```vue
<template>
  <Input @input_submitted="on_submit" />
  <DirectoryTree path="./" @directory_tree_file_selected="on_file_selected" />
  <VBox @mouse_move="on_mouse_move" @mouse_up="on_mouse_up" />
</template>
```
:::

事件名使用**蛇形命名（snake_case）**，对应 Textual Message 类名转小写，如：
- `Input.Submitted` → `@input_submitted`
- `DirectoryTree.FileSelected` → `@directory_tree_file_selected`
- `Button.Pressed` → `@click`（Button 有简化别名）

---

## 深入了解

- [快速上手](/textual_vuepy/quick-start/quick-start) — 安装、运行、第一个应用
- [Textual 官方文档](https://textual.textualize.io/) — 了解底层 Widget 的完整属性与事件
- [Vue.py 指南](/guide/introduction) — 响应式、组件通信、插槽等核心概念
