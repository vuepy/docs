---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
import { withBase } from 'vitepress'
</script>

# Panel-vuepy 快速上手 {#quick-start}

<img style="display: inline; width: 30px" src="/images/vpanel-logo.svg" alt="panel-vuepy-logo"> 
Panel-vuepy 是基于 Vue.py 和 <a href='https://panel.holoviz.org/index.html' target='_blank'>Panel</a> 开发的现代化 Python 组件库。它结合了 Vuepy 的响应式开发能力与 Panel 强大的数据探索功能，为开发者提供了一套完整的解决方案：

* 丰富的交互式 UI 组件 - 开箱即用的现代化组件，轻松构建专业级界面
* 深度 PyData 生态集成 - 无缝对接 Python 数据科学生态，实现流畅的数据可视化与分析
* 高效的应用开发框架 - 结合 Vue.py 的响应式特性和 Panel 的灵活后端，快速开发交互式 Web 应用

无论是构建数据仪表盘、开发分析工具，还是创建复杂的业务应用，Panel-vuepy 都能让开发者以前端框架的体验享受 Python 的高效开发流程。


## 安装

```sh
pip install 'vuepy-core[panel]'
```

## 运行 {#run-application}

:::tip 前提条件

- 已安装 vuepy
- 已安装 Panel-vuepy
- 已安装 JupyterLab
  :::

:::tip
使用`panel-vuepy`时，强烈推荐`panel`作为`backend`。
:::

<VTCodeGroup>
  <VTCodeGroupTab label="%%vuepy_run">

  ```python{2,5}
from vuepy.utils import magic
from panel_vuepy import vpanel

# -- cell --
%%vuepy_run --plugins vpanel --backend=panel
<template>
  <PnButton name='click'/>
</template>
  ```
  </VTCodeGroupTab>

  <VTCodeGroupTab label="%vuepy_run">

  ```python{2,4}
from vuepy.utils import magic
from panel_vuepy import vpanel

%vuepy_run app.vue --plugins vpanel --backend=panel
  ```
  </VTCodeGroupTab>

  <VTCodeGroupTab label="use 插件方式">

  ```python{2,12}
from vuepy import create_app, import_sfc
from panel_vuepy import vpanel

App = import_sfc("""
<template>
  <PnButton name='click'/>
</template>
""", raw_content=True)
# or
# App = import_sfc('App.vue')  # 根据 App.vue 实际位置修改
app = create_app(App, backend='panel')
app.use(vpanel)
app.mount()
  ```
  </VTCodeGroupTab>

</VTCodeGroup>


## 部署应用 {#deploy-application}

:::tip 前提条件

- 已安装 vuepy
- 已安装 Panel
- 已安装 Panel-vuepy
- 已安装 JupyterLab
  :::

将 `ipynb` 文件中的 `app` 声明为`servable`

<VTCodeGroup>

  <!-- <VTCodeGroupTab label="%%vuepy_run">

  ```python{2,5}
from vuepy.utils import magic
from panel_vuepy import vpanel

# -- cell --
%%vuepy_run --plugins vpanel
<template>
  <PnButton name='click'/>
</template>
  ```
  </VTCodeGroupTab>

  <VTCodeGroupTab label="%vuepy_run">

  ```python{2,4}
from vuepy.utils import magic
from panel_vuepy import vpanel

%vuepy_run app.vue --plugins vpanel
  ```
  </VTCodeGroupTab> -->

  <VTCodeGroupTab label="use 插件方式">

  ```python{2,11}
from vuepy import create_app, import_sfc
from panel_vuepy import vpanel

App = import_sfc("""
<template>
  <PnButton name='click'/>
</template>
""", raw_content=True)
# or
# App = import_sfc('App.vue')  # 根据 App.vue 实际位置修改
app = create_app(App, backend='panel', servable=True)
app.use(vpanel)
app.mount()
  ```
  </VTCodeGroupTab>

</VTCodeGroup>

使用 Panel 运行 ipynb 文件

```bash
panel server app.ipynb
```

运行结果看起来像

```
$ panel serve app.ipynb --dev
2025-07-02 00:06:21,186 Starting Bokeh server version 3.7.2 (running on Tornado 6.3.3)
2025-07-02 00:06:21,186 User authentication hooks NOT provided (default user enabled)
2025-07-02 00:06:21,189 Bokeh app running at: http://localhost:5006/Column-test
2025-07-02 00:06:21,189 Starting Bokeh server with process id: 39710
```

打开 http://localhost:5006/app

![]()

参考：
* [Panel: Serve Apps](https://panel.holoviz.org/tutorials/intermediate/serve.html)

## 下一步 {#next-steps}

[//]: # (如果你尚未阅读[Panel vuepy组件总览]&#40;/vleaflet/map&#41;，我们强烈推荐你在移步到后续文档之前返回去阅读一下。)

<div class="vt-box-container next-steps">

  <a class="vt-box" :href="withBase('/panel_vuepy/overview')">
    <p class="next-steps-link">继续阅读该指南</p>
    <p class="next-steps-caption">该指南会带你深入了解 Panel vuepy 组件库的全貌。</p>
  </a>

</div>
