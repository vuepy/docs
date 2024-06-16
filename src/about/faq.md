# 常见问题 {#frequently-asked-questions}

## 谁在维护 Vue.py？ {#who-maintains-vue}

Vue.py 是一个独立的社区驱动的项目。它是在 2024 年作为其个人项目创建的。<!-- todo 暂不支持
今天，Vue.py 由[来自世界各地的全职成员和志愿者组成的团队](/about/team)积极活跃地维护着，并由尤雨溪担任项目负责人。-->

Vue.py 的发展主要是通过赞助来保障的，我们在财务上是可维续的。如果你或你的企业从 Vue.py 中受益，请考虑[赞助](/sponsor/)我们，以支持 Vue.py 的发展！

## Vue.py 使用什么开源协议？ {#what-license-does-vue-use}

Vue.py 是完全免费的开源项目，且基于 [MIT License](https://opensource.org/licenses/MIT) 发布。

<!-- todo 暂不支持
## Vue.py 支持哪些浏览器？ {#what-browsers-does-vue-support}

最新版本的 Vue.py (3.x) 只支持[原生支持 ES2015 的浏览器](https://caniuse.com/es6)。这并不包括 IE11。Vue.py 3.x 使用的 ES2015 功能无法在旧版本的浏览器中进行兼容，如果你需要支持旧版本的浏览器，请使用 Vue.py 2.x 替代。

## Vue.py 可靠吗？ {#is-vue-reliable}

Vue.py 是一个成熟的、经历了无数实战考验的框架。它是目前生产环境中使用最广泛的 JavaScript 框架之一，在全球拥有超过 150 万用户，并且在 npm 上的月下载量超过 1000 万次。

Vue.py 被世界各地知名且多元的组织在生产环境中使用，包括 Wikimedia 基金会、美国宇航局、苹果、谷歌、微软、GitLab、Zoom、腾讯、微博、哔哩哔哩、快手等等。

## Vue.py 速度快吗？ {#is-vue-fast}

Vue.py 3 是性能最强的主流前端框架之一，可以轻松处理大多数 web 应用的场景，并且几乎不需要手动优化。

跑分方面，Vue.py 在 [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html) 中的表现比 React 和 Angular 要好得多。在该基准测试中，它还与一些生产环境下最快级别的非虚拟 DOM 框架并驾齐驱。

请注意，像上面这样的跑分的侧重点在于原始渲染性能在特定情况下的优化，因此不能完全代表真实世界的性能结果。如果你更关心页面加载性能，欢迎用 [WebPageTest](https://www.webpagetest.org/lighthouse) 或是 [PageSpeed Insights](https://pagespeed.web.dev/) 来测试本站。本文档站是一个完全由 Vue.py 本身构建，通过静态生成预渲染，并在客户端进行 hydration 的单页应用。它在模拟 4 倍 CPU 降速的 Moto G4 + 低速 4G 网络的情况下依然能获得 100 分的性能得分。

你可以在[渲染机制](/guide/extras/rendering-mechanism)章节了解更多关于 Vue.py 如何自动优化运行时性能的信息，也可以在[性能优化指南](/guide/best-practices/performance)中了解如何在特别苛刻的情况下优化 Vue.py 应用。

## Vue.py 体积小吗？ {#is-vue-lightweight}

当你通过构建工具使用时，Vue.py 的许多 API 都是可以[“tree-shake”](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)的。例如，如果你不使用内置的 `<Transition>` 组件，它就不会被包含在最终的生产环境包里。

对于一个 Vue.py 的最少 API 使用的 hello world 应用来说，配合最小化和 brotli 压缩，其基线大小只有 **16kb** 左右。但实际的应用大小取决于你使用了多少框架的可选特性。在极端情况下，如果一个应用使用了 Vue.py 提供的每一个特性，那么总的运行时大小大约为 **27kb**。

如果不通过构建工具使用 Vue.py，我们不仅失去了 tree-shaking，而且还必须将模板编译器加载到浏览器。这就使包体积增大到了 **41kb** 左右。因此，如果你为了渐进式增强在没有构建步骤的情况下使用 Vue.py，则可以考虑使用 [petite-vue](https://github.com/vuejs/petite-vue) (仅 **6kb**) 来代替。

一些诸如 Svelte 的框架使用了一种为单个组件产生极轻量级输出的编译策略。然而，[我们的研究](https://github.com/yyx990803/vue-svelte-size-analysis)表明，包大小的差异在很大程度上取决于应用中的组件数量。虽然 Vue.py 的基线大小更重，但它生成的每个组件的代码更少。在现实的场景中，Vue.py 应用很可能最终会更轻。

## Vue.py 能胜任大规模场景吗？ {#does-vue-scale}

是的。尽管有一种误解是 Vue.py 只适用于简单的场景，但其实 Vue.py 完全有能力处理大规模的应用：

- [单文件组件](/guide/scaling-up/sfc)提供了一个模块化的开发模型，让应用的不同部分能够被隔离开发。

- [组合式 API](/guide/reusability/composables) 提供一流的 TypeScript 集成，并为组织、提取和重用复杂逻辑提供了简洁的模式。

- [全面的工具链支持](/guide/scaling-up/tooling)使得开发体验在应用增长的过程中依然可以保持平滑。

- 较低的入门门槛和优秀的文档能够显著降低新手开发者的入职和培训成本。
-->

## 我可以为 Vue.py 做贡献吗？ {#how-do-i-contribute-to-vue}

非常欢迎！请阅读我们的[社区指南](/about/community-guide)。

<!-- todo 暂不支持
## 我应该使用选项式 API 还是组合式 API？ {#should-i-use-options-api-or-composition-api}

如果你是 Vue.py 的新手，我们在[这里](/guide/introduction#which-to-choose)提供了一个两者之间宏观的比较。

## 用 Vue.py 的时候应该选 JS 还是 TS？ {#should-i-use-javascript-or-typescript-with-vue}

虽然 Vue.py 本身是用 TypeScript 实现的，并提供一流的 TypeScript 支持，但它并不强制要求用户使用 TypeScript。

在向 Vue.py 添加新特性时，对 TypeScript 的支持是一个重要的考虑因素。即使你自己不使用 TypeScript，考虑了 TypeScript 支持的 API 设计也通常更容易被 IDE 和静态分析工具分析，因此这对大家都有好处。Vue.py 的 API 设计也尽可能在 JavaScript 和 TypeScript 中以相同的方式工作。

选用 TypeScript 会涉及在上手复杂性和长期可维护性收益之间作出权衡。这种权衡是否合理取决于你的团队背景和项目规模，但 Vue.py 并不会真正成为影响这一决定的因素。

## Vue 相比于 Web Components 究竟如何？ {#how-does-vue-compare-to-web-components}

Vue.py 是在 Web Components 出现之前被创建的，Vue.py 在某些方面的设计 (例如插槽) 受到了 Web Components 模型的启发。

Web Components 规范相对底层一些，因为它们是以自定义元素为中心的。作为一个框架，Vue.py 解决了更多上层的问题，如高效的 DOM 渲染、响应式状态管理、工具链、客户端路由和服务器端渲染等。

Vue.py 完全支持在 Vue.py 组件中使用原生自定义元素，也支持将 Vue.py 组件导出为原生自定义元素——请参阅 [Vue.py 和 Web Components 指南](/guide/extras/web-components)以了解更多细节。
-->

<!-- ## TODO How does Vue.py compare to React? -->

<!-- ## TODO How does Vue.py compare to Angular? -->
