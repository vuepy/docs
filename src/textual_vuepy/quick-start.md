---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
import { withBase } from 'vitepress'
</script>

# Textual-vuepy 快速上手 {#quick-start}

Textual-vuepy 是基于 Vue.py 和 [Textual](https://textual.textualize.io/) 构建终端 TUI（Text User Interface）应用的组件库。它让你使用 Vue.py 的响应式开发体验来编写运行在终端中的交互式应用：

* **丰富的终端组件** — 直接映射 Textual 所有内置 Widget，开箱即用
* **响应式 SFC 开发** — 与 IPywUI/Panel-vuepy 使用完全相同的 `.vue` 文件语法
* **TCSS 样式支持** — 在 `<style lang="tcss">` 块中编写 Textual CSS
* **VueUse 工具集** — `onKeyStroke`、`useMouse` 等键鼠事件组合式函数
* **一键运行** — 通过 `vuepy run` 命令行直接运行 `.vue` 文件

## 安装 {#install}

```sh
pip install 'vuepy-core[textual]'
```

## 运行应用 {#run-application}

### 命令行运行（推荐）

使用 `vuepy run` 命令直接运行 `.vue` 文件（默认使用 textual 后端）：

```sh
vuepy run App.vue
```

开发模式（启用 Textual devtools）：

```sh
vuepy run App.vue --dev
```

通过 `textual-serve` 以 Web 方式访问（需安装 `pip install textual-serve`）：

```sh
vuepy run App.vue --servable --serve-port 8000
```

查看所有内置可运行的应用名称：

```sh
vuepy run --help
```

### 代码方式运行

<VTCodeGroup>
  <VTCodeGroupTab label="import_sfc">

  ```python
from vuepy import create_app, import_sfc

App = import_sfc('App.vue')
app = create_app(App, backend='textual')
app.mount()
  ```

  </VTCodeGroupTab>

  <VTCodeGroupTab label="使用插件">

  ```python
from vuepy import create_app, import_sfc
from textual_vuepy import vtextual

App = import_sfc('App.vue')
app = create_app(App, backend='textual')
app.use(vtextual)
app.mount()
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

## 第一个 Textual-vuepy 应用 {#first-app}

创建 `App.vue` 文件：

:::textual-vuepy-demo quick_start_first_app
```vue
<template>
  <VBox style="height: 1fr; align: center middle;">
    <Label :label="f'Count: {count.value}'" />
    <HBox>
      <Button label="+" @click="increment()" />
      <Button label="-" @click="decrement()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

count = ref(0)

def increment():
    count.value += 1

def decrement():
    count.value -= 1
</script>

<style lang="tcss">
VBox {
    height: 1fr;
    align: center middle;
}

Button {
    width: 6;
    margin: 0 1;
}
</style>
```
:::

运行：

```sh
vuepy run App.vue
```

## 与 IPywUI 的关键差异 {#differences}

| 特性 | IPywUI（Jupyter）| Textual-vuepy（终端）|
|------|:---------------:|:-------------------:|
| 安装 | `vuepy-core[ipywidgets]`| `vuepy-core[textual]` |
| 运行环境 | JupyterLab | 终端 |
| 后端参数 | `backend='ipywidgets'`（默认）| `backend='textual'` |
| 样式语言 | CSS | TCSS（Textual CSS）|
| `<style>` 块 | 不支持 | ✅ 支持 |
| HTML 转义 | ✅ 转义（HTML 渲染）| ❌ 不转义（终端渲染）|
| 访问底层对象 | - | `app.tt_app`（Textual App 实例）|
| 通知/消息 | - | `app.message("text")` |

## ref 获取底层 Widget {#ref-widget}

通过 `ref` 引用组件，再调用 `.value.unwrap()` 获取底层 Textual Widget 对象：

:::textual-vuepy-demo quick_start_ref_widget
```vue
<template>
  <RichLog ref="log_ref" highlight markup />
</template>

<script lang="py">
from vuepy import ref, onMounted

log_ref = ref(None)

@onMounted
def on_mount():
    widget = log_ref.value.unwrap()  # 获取 Textual RichLog widget
    widget.write("[bold green]Hello[/bold green]")
    widget.focus()
</script>
```
:::

## TCSS 样式 {#tcss-style}

在 `<style lang="tcss">` 块中编写 [Textual CSS](https://textual.textualize.io/guide/CSS/)：

:::textual-vuepy-demo quick_start_tcss
```vue
<template>
  <VBox id="container">
    <Button id="btn-primary" label="主按钮" @click="on_click()" />
  </VBox>
</template>

<style lang="tcss">
#container {
    height: 1fr;
    align: center middle;
    background: #1a1d23;
}

#btn-primary {
    width: 20;
    background: $accent;
    color: $text;
}
</style>
```
:::

也可以在模板中用 `:style` 绑定内联 TCSS：

```vue
<Button :style="f'width: {width.value}fr;'" label="动态宽度" />
```

## 键鼠事件（VueUse）{#vueuse}

Textual-vuepy 提供了 VueUse 风格的组合式函数：

```vue
<script lang="py">
from textual_vuepy.vueuse import onKeyStroke, useMouse

# 监听键盘按键
def on_ctrl_q(event):
    app.tt_app.exit()

onKeyStroke('ctrl+q', on_ctrl_q)

# 追踪鼠标坐标
mouse_x, mouse_y = useMouse()
</script>
```

## Provide / Inject {#provide-inject}

通过 `TextualProvides.APP_MIXIN` 向 Textual App 注入 Mixin，实现自定义按键处理、命令等：

```vue
<script lang="py">
from vuepy.compiler_sfc.codegen_backends.textual import TextualProvides

class KeyHandlerMixin:
    def _on_key(self, event) -> None:
        # 将按键信息写入日志
        log_ref.value.unwrap().write(repr(event))

app.provide(TextualProvides.APP_MIXIN, KeyHandlerMixin)
</script>
```

## 内置应用 {#builtin-apps}

安装 `textual_vuepy` 后，以下应用已通过 `VuepyAppStore` 注册，可直接按名称运行：

| 应用名 | 说明 |
|--------|------|
| `playground` | 交互式 SFC 编辑器，支持实时预览和文件热重载 |
| `keys` | 按键查看器，显示所有键盘事件信息 |

```sh
# 启动内置 Playground
vuepy run playground

# 启动按键查看器
vuepy run keys
```

## 下一步 {#next-steps}

<div class="vt-box-container next-steps">

  <a class="vt-box" :href="withBase('/textual_vuepy/overview')">
    <p class="next-steps-link">Textual-vuepy 组件总览</p>
    <p class="next-steps-caption">浏览所有可用的终端 UI 组件。</p>
  </a>

  <a class="vt-box" :href="withBase('/guide/essentials/application')">
    <p class="next-steps-link">继续阅读 Vue.py 指南</p>
    <p class="next-steps-caption">了解响应式、组件通信等核心概念。</p>
  </a>

</div>
