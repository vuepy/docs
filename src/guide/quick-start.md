---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
import { withBase } from 'vitepress'
</script>

# 快速上手 {#quick-start}

[//]: # (## 线上尝试 Vue {#try-vue-online})

[//]: # ()
[//]: # (- 想要快速体验 Vue，你可以直接试试我们的[演练场]&#40;https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==&#41;。)

[//]: # ()
[//]: # (- 如果你更喜欢不用任何构建的原始 HTML，可以使用 [JSFiddle]&#40;https://jsfiddle.net/yyx990803/2ke1ab0z/&#41; 入门。)

[//]: # ()
[//]: # (- 如果你已经比较熟悉 Node.js 和构建工具等概念，还可以直接在浏览器中打开 [StackBlitz]&#40;https://vite.new/vue&#41; 来尝试完整的构建设置。)

## 安装

```sh
pip install org.vuepy.core
```

## 创建一个 Vue.py 应用 {#creating-a-vue-application}

:::tip 前提条件

- 熟悉命令行
- 已安装 Vue.py
:::

在本节中，我们将介绍如何在本地搭建 Vue.py [单页应用](/guide/extras/ways-of-using-vue#single-page-application-spa), 并允许我们使用 Vue.py 的[单文件组件](/guide/scaling-up/sfc) (SFC)。

确保你安装了最新版本的 Vue.py，并且你的当前工作目录正是打算创建项目的目录。在命令行中运行以下命令 (不要带上 `$` 符号)：

<VTCodeGroup>
  <VTCodeGroupTab label="Vue.py">

  ```sh
  $ python -m vuepy create
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

这一指令将会安装并执行项目脚手架工具。你将会看到一些诸如 项目名称之类的提示：

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

如果不确定是否要开启某个功能，你可以直接按下回车键选择 `No`。在项目被创建后，生成如下目录结构：
* `ipywui`: Vue.py自带的组件库文件（Vue.py组件文件，方便开发时进行自动补全，仅在开发时依赖）。
* `App.vue`: 单页应用文件的单文件组件。
* `app.py`: 单页应用文件的setup文件。
* `app.ipynb`: 加载单页应用的 IPython Notebook 文件。

<VTCodeGroup>
  <VTCodeGroupTab label="tree">

  ```sh
<your-project-name>
├── App.vue
├── app.py
├── app.ipynb
└── ipywui
  ```

  </VTCodeGroupTab>

</VTCodeGroup>


## 运行 Vue.py 应用 {#run-vue-application}

:::tip 前提条件

- 已创建 Vue.py 应用
- 已安装 JupyterLab
  :::

可以在 JupyterLab 中通过运行`app.ipynb`加载应用，也可以在已有的 `notebook` 中通过 `import_sfc` 或 `%vuepy_import` 魔法方法 加载应用。

<VTCodeGroup>
  <VTCodeGroupTab label="import_sfc">

  ```python
from pathlib import Path
from vuepy import create_app, import_sfc

# 根据 App.vue 实际位置修改
App= import_sfc(Path() / 'App.vue')
app = create_app(App)
app.mount()
  ```

  </VTCodeGroupTab>

  <VTCodeGroupTab label="%vuepy_import">

  ```python
from pathlib import Path

from vuepy import create_app
from vuepy.utils import magic

App =%vuepy_import {Path() / 'App.vue'}
app = create_app(App)
app.mount()
  ```

  </VTCodeGroupTab>

</VTCodeGroup>

你现在应该已经运行起来了你的第一个 Vue.py 项目！下面是一些补充提示：

- 推荐的 IDE 配置是 [Visual Studio Code](https://code.visualstudio.com/) + [Vue - Official 扩展](https://marketplace.visualstudio.com/items?itemName=Vue.volar)。
- 另一个推荐的 IDE 配置是 PyCharm + [Vue 插件](https://plugins.jetbrains.com/plugin/9442-vue-js)。如果使用其他编辑器，参考 [IDE 支持章节](/guide/scaling-up/tooling#ide-support)。

[//]: # (- 更多工具细节，包括与后端框架的整合，我们会在[工具链指南]&#40;/guide/scaling-up/tooling&#41;进行讨论。)
[//]: # (- 要了解构建工具 Vite 更多背后的细节，请查看 [Vite 文档]&#40;https://cn.vitejs.dev&#41;。)
[//]: # (- 如果你选择使用 TypeScript，请阅读 [TypeScript 使用指南]&#40;typescript/overview&#41;。)

## 下一步 {#next-steps}

如果你尚未阅读[简介](/guide/introduction)，我们强烈推荐你在移步到后续文档之前返回去阅读一下。

<div class="vt-box-container next-steps">

  <a class="vt-box" :href="withBase('/guide/essentials/application')">
    <p class="next-steps-link">继续阅读该指南</p>
    <p class="next-steps-caption">该指南会带你深入了解框架所有方面的细节。</p>
  </a>

[//]: # (  <a class="vt-box" href="/tutorial/">)
[//]: # (    <p class="next-steps-link">尝试互动教程</p>)
[//]: # (    <p class="next-steps-caption">适合喜欢边动手边学的读者。</p>)
[//]: # (  </a>)

[//]: # (  <a class="vt-box" href="/examples/">)
[//]: # (    <p class="next-steps-link">查看示例</p>)
[//]: # (    <p class="next-steps-caption">浏览核心功能和常见用户界面的示例。</p>)
[//]: # (  </a>)
</div>
