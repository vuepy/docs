---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
import { withBase } from 'vitepress'
</script>

# vleaflet 快速上手 {#quick-start}

<img style="display: inline; width: 35px" src="/images/vleaflet-logo.svg" alt="vleaflet-logo" width="50">
vleaflet 是基于 Vue.py 和 <a href='https://ipyleaflet.readthedocs.io/en/latest/index.html' target='_blank'>ipyleaflet </a> 开发的响应式地图组件库，在 Jupyter 中实现交互式地图。vleaflet 中的每个对象（包括地图、TileLayers、图层、控件等）都是响应式的：您可以从 Python 或浏览器动态更新属性。

## 安装

```sh
pip install 'vuepy-core[vleaflet]'
```

## 运行 {#run-application}

:::tip 前提条件

- 已安装 vuepy
- 已安装 vleaflet
- 已安装 JupyterLab
  :::

<VTCodeGroup>
  <VTCodeGroupTab label="use 插件方式">

  ```python{2,6}
from vuepy import create_app, import_sfc
from vleaflet import leaflet

App= import_sfc('App.vue')  # 根据 App.vue 实际位置修改
app = create_app(App)
app.use(leaflet)
app.mount()
  ```

  </VTCodeGroupTab>

  <VTCodeGroupTab label="%vuepy_run">

  ```python{2,4}
from vuepy.utils import magic
from vleaflet import leaflet

%vuepy_run app.vue --plugins leaflet
  ```

  </VTCodeGroupTab>

  <VTCodeGroupTab label="%%vuepy_run">

  ```python{2,5}
from vuepy.utils import magic
from vleaflet import leaflet

# -- cell --
%%vuepy_run --plugins leaflet
<template>
  <vl-map :center="[53, 354]" />
</template>
  ```

  </VTCodeGroupTab>

</VTCodeGroup>

## 下一步 {#next-steps}

[//]: # (如果你尚未阅读[Map 地图组件]&#40;/vleaflet/map&#41;，我们强烈推荐你在移步到后续文档之前返回去阅读一下。)

<div class="vt-box-container next-steps">

  <a class="vt-box" :href="withBase('/vleaflet/map')">
    <p class="next-steps-link">继续阅读该指南</p>
    <p class="next-steps-caption">该指南会带你深入了解 Map 组件方面的细节。</p>
  </a>

</div>
