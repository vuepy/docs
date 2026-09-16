# Vuepy.org 中文文档

## 如何参与贡献

有劳访问 [wiki](https://github.com/vuejs-translations/docs-zh-cn/wiki) 了解相关注意事项。

目前网站处于维护状态，欢迎大家：

- 修复错别字或错误的书写格式
- 发 issue 讨论译法或书写格式
- 发 issue 讨论部署或协作流程上的问题

## 如何在本地编辑和预览该网站

本项目要求：

- Node.js 为 `v14.0.0` 或更高版本
- pnpm 为 `v7.4.0` 或更高版本

本站基于 [VitePress](https://github.com/vuejs/vitepress) 和 [@vue/theme](https://github.com/vuejs/vue-theme) 建立。网站内容以 Markdown 格式书写，位于 `src` 文件夹中。

```sh
pnpm i
pnpm run dev
```


## 贡献者列表

本站从 [vuejs-translations/docs-zh-cn](https://github.com/vuejs-translations/docs-zh-cn) fork而来，因此保留原仓库的贡献者列表。

最新的文档/翻译贡献情况可以参阅 GitHub 提供的 [contributors](https://github.com/vuejs-translations/docs-zh-cn/graphs/contributors) 页面。

以下是基于该仓库中 PR 和 commit 统计并按总数量排序的所有贡献者，[生成逻辑可在此查阅](https://github.com/ShenQingchuan/github-contributor-svg-generator)。

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ShenQingchuan/github-contributor-svg-generator@main/.github-contributors/vuejs-translations_docs-zh-cn.svg">
    <img src="https://cdn.jsdelivr.net/gh/ShenQingchuan/github-contributor-svg-generator@main/.github-contributors/vuejs-translations_docs-zh-cn.svg" />
  </a>
</p>

## 版权声明

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议  (CC BY-NC-SA 4.0) </a>进行许可。

## ipynb 文档转换方案

实现了将ipynb文件转换为md文件，并保留ipynb中已渲染的小组件.

外层md使用 `ipywui-demo` 容器，里面包含一个ipynb文件。

```md
:::ipywui-demo test
src/examples/ipywui/component/accordion
:::
```

之后会使用 [`ipynb-markdown-transform`](./.vitepress/plugins/ipynb-markdown-transform.ts) 插件将ipynb文件转换为md文件，并替换到 `ipywui-demo` 容器中。
大致的流程为:

读取 `src/examples/ipywui/component/accordion.ipynb` 文件, 本质是json文件,结构为:
```json
{
    "cells": [
        {
            "cell_type": "markdown" | "code" | "raw",
            "source": ["# 标题"],
            "metadata": {}
        }
    ]
}
```
* 当cell_type为markdown时,渲染为markdown文件
* 当cell_type为code时,渲染为代码文件,使用‵<IpywuiDemo></IpywuiDemo>‵容器包裹,并使用‵<template #src>‵和‵<template #output>‵包裹代码和输出(对应代码渲染好的组件)。
* 当cell_type为raw时,渲染为原始文件。

## textual 文档转换方案

