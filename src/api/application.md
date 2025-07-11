# 应用实例 API {#application-api}

## create_app() {#createapp}

创建一个应用实例。

- **类型**

  ```py
  RootComponent = Type[VueComponent] | SFCType | dict
  
  def create_app(
      root_component: RootComponent, 
      use_wui: bool = True,
      backend: str = codegen_backends.ipywidgets.NAME,
      servable: bool = False,
      debug: bool = False,
      **root_props
  ) -> App:
  ```

- **详细信息**

|  参数           | 说明                              | 类型        | 默认值      |
| -------------- | --------------------------------- | ---------- | ----------- |
| root_component | 根组件，可以是组件类型、SFC类型或字典形式的组件选项  | ^[RootComponnet]`Type[VueComponent] \| SFCType \| dict` | — |
| use_wui        | 是否使用ipywui插件                  | ^[bool]    | True     |
| backend        | 代码生成后端，如`ipywidgets`、`panel` | ^[str]`ipywidgets, panel`  | 'ipywidgets' |
| servable       | 是否启用可服务模式                   | ^[bool]    | False    |
| debug          | 是否启用调试模式                     | ^[bool]    | False    |
| root_props   | 传递给根组件的属性，预留参数             | ^[dict]    | {}     |

tips: 当使用`panel-vuepy`组件库时，建议使用`panel`作为`backend`。

- **示例**

  可以直接内联根组件：

  ```py
  from vuepy import create_app

  app = create_app({
    # 根组件选项
    'setup': lambda *args: {},
    'template': '''
      <Button label='click'></Button>
      <p></p>
    '''
  })
  
  # 或 从 VueOptions 创建
  from vuepy import VueOptions
  Comp = Vueoptions(**{
    # 根组件选项
    'setup': lambda *args: {},
    'template': '''
      <Button label='click'></Button>
      <p></p>
    '''
  })
  app = create_app(Comp)
  
  ```

  也可以使用从别处导入的组件：

  ```py
  from vuepy import create_app, import_sfc
  
  App = import_sfc('./App.vue')

  app = create_app(App)
  ```

- **参考**[指南 - 创建一个 Vue 应用实例](/guide/essentials/application)

<!-- todo 暂不支持
## <sup class=''/> createSSRApp() {#createssrapp}

以 [SSR 激活](/guide/scaling-up/ssr#client-hydration)模式创建一个应用实例。用法与 `createApp()` 完全相同。

-->

## app.mount() {#app-mount}

将应用实例挂载在一个容器元素中。

- **类型**

  ```py
  class App:
    def mount(el: ipywidgets.Output = None) -> Document:
  ```

- **详细信息**

  参数可以是一个实际的 Output, 传入为 None 时自动创建一个Output 元素，可以通过 app._container 访问。返回根组件的实例。

<!-- todo 暂不支持
  如果该组件有模板或定义了渲染函数，它将替换容器内所有现存的 DOM 节点。否则在运行时编译器可用的情况下，容器元素的 `innerHTML` 将被用作模板。

  在 SSR 激活模式下，它将激活容器内现有的 DOM 节点。如果出现了[激活不匹配](/guide/scaling-up/ssr#hydration-mismatch)，那么现有的 DOM 节点将会被修改以匹配客户端的实际渲染结果。

  对于每个应用实例，`mount()` 仅能调用一次。
-->

- **示例**

  ```py
  from vuepy import create_app
  
  app = create_app(...)

  app.mount()
  ```

  也可以挂载到一个已有的 Output 上。

  ```py
  import ipywidgets
  
  output = ipywidgets.Output()
  app.mount(output)
  ```

## <sup class=""/> app.unmount() <sup class="vt-badge dev-only" data-text="Reserved" /> {#app-unmount}

:::warning
请注意，这是一个预留的语法，当前版本未实现。

卸载一个已挂载的应用实例。卸载一个应用会触发该应用组件树内所有组件的卸载生命周期钩子。

- **类型**

  ```ts
  interface App {
    unmount(): void
  }
  ```

:::
<!-- end revered_text -->

## app.component() {#app-component}

如果同时传递一个组件名字符串及其定义，则注册一个全局组件；如果只传递一个名字，则会返回用该名字注册的组件 (如果存在的话)。

- **类型**

  ```py
  class App:
    def component(name: str) -> Component | undefined:
    def component(name: str, component: VueComponent): -> self
  ```

- **示例**

  ```py
  from vuepy import create_app

  app = create_app({})

  # 注册一个选项对象
  app.component('MyComponent', MyComponent)

  # 得到一个已注册的组件
  MyComponent = app.component('MyComponent')
  ```

- **参考**[组件注册](/guide/components/registration)

## <sup class=""/> app.directive() <sup class="vt-badge dev-only" data-text="Reserved" /> {#app-directive}

:::warning
请注意，这是一个预留的语法，当前版本未实现。

如果同时传递一个名字和一个指令定义，则注册一个全局指令；如果只传递一个名字，则会返回用该名字注册的指令 (如果存在的话)。

- **类型**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **示例**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // 注册（对象形式的指令）
  app.directive('my-directive', {
    /* 自定义指令钩子 */
  })

  // 注册（函数形式的指令）
  app.directive('my-directive', () => {
    /* ... */
  })

  // 得到一个已注册的指令
  const myDirective = app.directive('my-directive')
  ```

- **参考**[自定义指令](/guide/reusability/custom-directives)

:::
<!-- end revered_text -->

## app.use() {#app-use}

安装一个[插件](/guide/reusability/plugins)。

- **类型**

  ```py
  class App:
    def use(self, plugin: Type["VuePlugin"], options: dict = None) -> self:
  ```

- **详细信息**

  第一个参数应是插件本身，可选的第二个参数是要传递给插件的选项。

  插件可以是一个带 `install()` 方法的对象，亦或直接是一个将被用作 `install()` 方法的函数。插件选项 (`app.use()` 的第二个参数) 将会传递给插件的 `install()` 方法。

  若 `app.use()` 对同一个插件多次调用，该插件只会被安装一次。

- **示例**

  ```py
  from vuepy import create_app
  from plugins import MyPlugin

  const app = create_app({
    # /* ... */
  })

  app.use(MyPlugin)
  ```

- **参考**[插件](/guide/reusability/plugins)

## <sup class=""/> app.provide() <sup class="vt-badge dev-only" data-text="Reserved" /> {#app-provide}

:::warning
请注意，这是一个预留的语法，当前版本未实现。

提供一个值，可以在应用中的所有后代组件中注入使用。

- **类型**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **详细信息**

  第一个参数应当是注入的 key，第二个参数则是提供的值。返回应用实例本身。

- **示例**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'hello')
  ```

  在应用的某个组件中：

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'hello'
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'hello'
    }
  }
  ```

  </div>

- **参考**
  - [依赖注入](/guide/components/provide-inject)
  - [应用层 Provide](/guide/components/provide-inject#app-level-provide)
  - [app.runWithContext()](#app-runwithcontext)

:::
<!-- end revered_text -->

## <sup class=""/> app.runWithContext() <sup class="vt-badge dev-only" data-text="Reserved" /> {#app-runwithcontext}

:::warning
请注意，这是一个预留的语法，当前版本未实现。

使用当前应用作为注入上下文执行回调函数。

- **类型**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **详情**

  需要一个回调函数并立即运行该回调。在回调同步调用期间，即使没有当前活动的组件实例，`inject()` 调用也可以从当前应用提供的值中查找注入。回调的返回值也将被返回。

- **示例**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

:::
<!-- end revered_text -->

## app.version {#app-version}

提供当前应用所使用的 Vue 版本号。这在[插件](/guide/reusability/plugins)中很有用，因为可能需要根据不同的 Vue 版本执行不同的逻辑。

- **类型**

  ```py
  class App:
    version: str
  ```

- **示例**

  在一个插件中对版本作判断：

  ```py
    def install(self, app):
      version = int(app.version.split('.')[0])
      if app.version < 3:
        print('This plugin requires Vue 3')
  ```

- **参考**[全局 API - version](/api/general#version)

## app.config {#app-config}

每个应用实例都会暴露一个 `config` 对象，其中包含了对这个应用的配置设定。你可以在挂载应用前更改这些属性 (下面列举了每个属性的对应文档)。

```py
from vuepy import create_app

app = create_app({})

print(app.config)
```

## <sup class=""/> app.config.errorHandler <sup class="vt-badge dev-only" data-text="Reserved" /> {#app-config-errorhandler}

:::warning
请注意，这是一个预留的语法，当前版本未实现。
:::
<!-- end revered_text -->

用于为应用内抛出的未捕获错误指定一个全局处理函数。

- **类型**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` 是一个 Vue 特定的错误信息
      // 例如：错误是在哪个生命周期的钩子上抛出的
      info: string
    ) => void
  }
  ```

- **详细信息**

  错误处理器接收三个参数：错误对象、触发该错误的组件实例和一个指出错误来源类型信息的字符串。

  它可以从下面这些来源中捕获错误：

  - 组件渲染器
  - 事件处理器
  - 生命周期钩子
  - `setup()` 函数
  - 侦听器
  - 自定义指令钩子
  - 过渡 (Transition) 钩子

  :::tip
  在生产环境中，第三个参数 (`info`) 是一个缩短的代码，而不是含有完整信息的字符串。错误代码和字符串的映射可以参阅[生产环境错误代码参考](/error-reference/#runtime-errors)。
  :::

- **示例**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // 处理错误，例如：报告给一个服务
  }
  ```

## <sup class=""/> app.config.warnHandler <sup class="vt-badge dev-only" data-text="Reserved" /> {#app-config-warnhandler}

:::warning
请注意，这是一个预留的语法，当前版本未实现。
:::
<!-- end revered_text -->

用于为 Vue 的运行时警告指定一个自定义处理函数。

- **类型**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **详细信息**

  警告处理器将接受警告信息作为其第一个参数，来源组件实例为第二个参数，以及组件追踪字符串作为第三个参数。

  这可以用于过滤筛选特定的警告信息，降低控制台输出的冗余。所有的 Vue 警告都需要在开发阶段得到解决，因此仅建议在调试期间选取部分特定警告，并且应该在调试完成之后立刻移除。

  :::tip
  警告仅会在开发阶段显示，因此在生产环境中，这条配置将被忽略。
  :::

- **示例**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` 是组件层级结构的追踪
  }
  ```

## <sup class=""/> app.config.performance <sup class="vt-badge dev-only" data-text="Reserved" /> {#app-config-performance}

:::warning
请注意，这是一个预留的语法，当前版本未实现。
:::
<!-- end revered_text -->

设置此项为 `true` 可以在浏览器开发工具的"性能/时间线"页中启用对组件初始化、编译、渲染和修补的性能表现追踪。仅在开发模式和支持 [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) API 的浏览器中工作。

- **类型**：`boolean`

- **参考**[指南 - 性能](/guide/best-practices/performance)

## <sup class=""/> app.config.compilerOptions <sup class="vt-badge dev-only" data-text="Reserved" /> {#app-config-compileroptions}

:::warning
请注意，这是一个预留的语法，当前版本未实现。
:::
<!-- end revered_text -->

配置运行时编译器的选项。设置在此对象上的值将会在浏览器内进行模板编译时使用，并会影响到所配置应用的所有组件。另外你也可以通过 [`compilerOptions` 选项](/api/options-rendering#compileroptions)在每个组件的基础上覆盖这些选项。

::: warning 重要
此配置项仅在完整构建版本，即可以在浏览器中编译模板的 `vue.js` 文件中可用。如果你用的是带构建的项目配置，且使用的是仅含运行时的 Vue 文件版本，那么编译器选项必须通过构建工具的相关配置传递给 `@vue/compiler-dom`。

- `vue-loader`：[通过 `compilerOptions` loader 的选项传递](https://vue-loader.vuejs.org/zh/options.html#compileroptions)。并请阅读[如何在 `vue-cli` 中配置它](https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9-loader-%E9%80%89%E9%A1%B9)。

- `vite`：[通过 `@vitejs/plugin-vue` 的选项传递](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options)。
:::

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

用于指定一个检查方法来识别原生自定义元素。

- **类型** `(tag: string) => boolean`

- **详细信息**

  如果该标签需要当作原生自定义元素则应返回 `true`。对匹配到的标签，Vue 会将其渲染为原生元素而非将其视为一个 Vue 组件来解析。

  原生 HTML 和 SVG 标签不需要在此函数中进行匹配，Vue 的解析器会自动识别它们。

- **示例**

  ```js
  // 将所有标签前缀为 `ion-` 的标签视为自定义元素
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **参考** [Vue 与 Web Components](/guide/extras/web-components)

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

用于调整模板中空格的处理行为。

- **类型** `'condense' | 'preserve'`

- **默认** `'condense'`

- **详细信息**

  Vue 移除/缩短了模板中的空格以求更高效的模板输出。默认的策略是"缩短"，表现行为如下：

  1. 元素中开头和结尾的空格字符将被缩短为一个空格。
  2. 包含换行的元素之间的空白字符会被删除。
  3. 文本节点中连续的空白字符被缩短成一个空格。

  设置该选项为 `'preserve'` 则会禁用 (2) 和 (3) 两项。

- **示例**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

用于调整模板内文本插值的分隔符。

- **类型** `[string, string]`

- **默认** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **详细信息**

  此项通常是为了避免与同样使用 mustache 语法的服务器端框架发生冲突。

- **示例**

  ```js
  // 分隔符改为ES6模板字符串样式
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

用于调整是否移除模板中的 HTML 注释。

- **类型** `boolean`

- **默认** `false`

- **详细信息**

  默认情况下，Vue 会在生产环境移除所有注释，设置该项为 `true` 会强制 Vue 在生产环境也保留注释。在开发过程中，注释是始终被保留的。这个选项通常在 Vue 与其他依赖 HTML 注释的库一起使用时使用。

- **示例**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

一个用于注册能够被应用内所有组件实例访问到的全局属性的对象。

- **类型**

  ```py
  class AppConfig:
    globalProperties: Record
  ```

- **详细信息**

  与任何全局的东西一样，应该谨慎使用。

  如果全局属性与组件自己的属性冲突，组件自己的属性将具有更高的优先级。

- **用法**

  ```py
  app.config.globalProperties.msg = 'hello'
  ```

  这使得 `msg` 在应用的任意组件模板上都可用<!-- todo 暂不支持
，并且也可以通过任意组件实例的 `this` 访问到  -->：

  ```vue
  <template>
    {{ msg }} world
  </template>
  ```

<!-- todo 暂不支持
- **参考**[指南 - 扩展全局属性](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />
-->

## <sup class=""/> app.config.optionMergeStrategies <sup class="vt-badge dev-only" data-text="Reserved" /> {#app-config-optionmergestrategies}

:::warning
请注意，这是一个预留的语法，当前版本未实现。
:::
<!-- end revered_text -->

一个用于定义自定义组件选项的合并策略的对象。

- **类型**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **详细信息**

  一些插件或库对自定义组件选项添加了支持 (通过注入全局 mixin)。这些选项在有多个不同来源时可能需要特殊的合并策略 (例如 mixin 或组件继承)。

  可以在 `app.config.optionMergeStrategies` 对象上以选项的名称作为 key，可以为一个自定义选项注册分配一个合并策略函数。

  合并策略函数分别接受在父实例和子实例上定义的该选项的值作为第一和第二个参数。

- **示例**

  ```js
  const app = createApp({
    // 自身的选项
    msg: 'Vue',
    // 来自 mixin 的选项
    mixins: [
      {
        msg: 'Hello '
      }
    ],
    mounted() {
      // 在 this.$options 上暴露被合并的选项
      console.log(this.$options.msg)
    }
  })

  // 为 `msg` 定义一个合并策略函数
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // 打印 'Hello Vue'
  ```

- **参考**[组件实例 - `$options`](/api/component-instance#options)
