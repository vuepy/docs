# 创建一个 Vue.py 应用 {#creating-a-vue-application}

## 应用实例 {#the-application-instance}

每个 Vue.py 应用都是通过 [`create_app`](/api/application#createapp) 函数创建一个新的 **应用实例**：

```python
from vuepy import create_app

app = create_app({
  # 根组件选项
})
```

## 根组件 {#the-root-component}

我们传入 `create_app` 的对象实际上是一个组件，每个应用都需要一个“根组件”，其他组件将作为其子组件。

如果你使用的是单文件组件，我们可以直接从另一个文件中导入根组件。

```python
from vuepy import create_app, import_sfc

# 从一个单文件组件中导入根组件
App = import_sfc('./App.vue')

app = create_app(App)
```

虽然本指南中的许多示例只需要一个组件，但大多数真实的应用都是由一棵嵌套的、可重用的组件树组成的。例如，一个待办事项 (Todos) 应用的组件树可能是这样的：

```
App (root component)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

我们会在指南的后续章节中讨论如何定义和组合多个组件。在那之前，我们得先关注一个组件内到底发生了什么。

## 挂载应用 {#mounting-the-app}

应用实例必须在调用了 `.mount()` 方法后才会渲染出来。该方法接收一个“容器”参数：

```python
import ipywidgets

app.mount(ipywidgets.Output())

# or 
app.mount()
```

应用根组件的内容将会被渲染在容器元素里面。容器元素自己将**不会**被视为应用的一部分。

`.mount()` 方法应该始终在整个应用配置和资源注册完成后被调用。同时请注意，不同于其他资源注册方法，它的返回值是根组件实例而非应用实例。

## 应用配置 {#app-configurations}

[//]: # (应用实例会暴露一个 `.config` 对象允许我们配置一些应用级的选项，例如定义一个应用级的错误处理器，用来捕获所有子组件上的错误：)
[//]: # ()
[//]: # (```js)
[//]: # (app.config.errorHandler = &#40;err&#41; => {)
[//]: # (  /* 处理错误 */)
[//]: # (})
[//]: # (```)

应用实例提供了一些方法来注册应用范围内可用的资源，例如注册一个组件：

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

这使得 `TodoDeleteButton` 在应用的任何地方都是可用的。我们会在指南的后续章节中讨论关于组件和其他资源的注册。你也可以在 [API 参考](/api/application)中浏览应用实例 API 的完整列表。

确保在挂载应用实例之前完成所有应用配置！

## 多个应用实例 {#multiple-application-instances}

应用实例并不只限于一个。`create_app` API 允许你在同一个 Jupyter notebook 中创建多个共存的 Vue 应用，而且每个应用都拥有自己的用于配置和全局资源的作用域。

```python
app1 = create_app({
  # /* ... */
})
app1.mount()

app2 = create_app({
  # /* ... */
})
app2.mount()
```

[//]: # (如果你正在使用 Vue 来增强服务端渲染 HTML，并且只想要 Vue 去控制一个大型页面中特殊的一小部分，应避免将一个单独的 Vue 应用实例挂载到整个页面上，而是应该创建多个小的应用实例，将它们分别挂载到所需的元素上去。)

<!-- zhlint disabled -->
