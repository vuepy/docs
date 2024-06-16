# 插件 {#plugins}

## 介绍 {#introduction}

插件 (Plugins) 是一种能为 Vue.py 添加全局功能的工具代码。下面是如何安装一个插件的示例：

```py
from vuepy import create_app

app = createApp({})

app.use(MyPlugin, {
  # 可选的选项 
})
```

一个插件可以是一个拥有 `install()` 方法的对象，也可以直接是一个安装函数本身。安装函数会接收到安装它的[应用实例](/api/application)和传递给 `app.use()` 的额外选项作为参数：

```py
from vuepy import VuePlugin

class MyPlugin(VuePlugin):
    @classmethod
    def install(cls, app, options):
        # 配置此应用
```

插件没有严格定义的使用范围，但是插件发挥作用的常见场景主要包括以下几种：

1. 通过 [`app.component()`](/api/application#app-component) 和 [`app.directive()`](/api/application#app-directive) 注册一到多个全局组件<!-- todo 暂不支持 或自定义指令 -->。

<!-- todo 暂不支持
2. 通过 [`app.provide()`](/api/application#app-provide) 使一个资源[可被注入](/guide/components/provide-inject)进整个应用。
-->

2. 向 [`app.config.globalProperties`](/api/application#app-config-globalproperties) 中添加一些全局实例属性或方法

3. 一个可能包含了上述场景的功能库<!-- todo 暂不支持 (例如 [vue-router](https://github.com/vuejs/vue-router-next)) -->。

## 编写一个插件 {#writing-a-plugin}

为了更好地理解如何构建 Vue.py 插件，我们可以试着写一个简单的 `i18n` ([国际化 (Internationalization)](https://en.wikipedia.org/wiki/Internationalization_and_localization) 的缩写) 插件。

让我们从设置插件对象开始。建议在一个单独的文件中创建并导出它，以保证更好地管理逻辑，如下所示：

```py
# plugins/i18n.py
from vuepy import VuePlugin

class I18n(VuePlugin):
    @classmethod
    def install(cls, app, options):
        # 在这里编写插件代码
```

我们希望有一个翻译函数，这个函数接收一个以 `.` 作为分隔符的 `key` 字符串，用来在用户提供的翻译字典中查找对应语言的文本。期望的使用方式如下：

```vue-html
<h1>{{ s1_translate('greetings.hello') }}</h1>
```

这个函数应当能够在任意模板中被全局调用。这一点可以通过在插件中将它添加到 `app.config.globalProperties` 上来实现：

```py{7-16}
# plugins/i18n.js
from vuepy import VuePlugin

class I18nPlugin(VuePlugin):
    @classmethod
    def install(cls, app, options):
        def s1_translate(key):
            # 获取 `options` 对象的深层属性
            # 使用 `key` 作为索引
            ret = option
            for k in key.split('.'):
                ret = option.get(k, {})
            return ret
            
        # 注入一个全局可用的 s1_translate() 方法
        app.config.globalProperties.s1_translate = s1_translate
        
```

我们的 `s1_translate` 函数会接收一个例如 `greetings.hello` 的字符串，在用户提供的翻译字典中查找，并返回翻译得到的值。

用于查找的翻译字典对象则应当在插件被安装时作为 `app.use()` 的额外参数被传入：

```py
from plugin.i18n import I18nPlugin

app.use(I18nPlugin, {
  'greetings': {
    'hello': 'Bonjour!',
  },
})
```

这样，我们一开始的表达式 `s1_translate('greetings.hello')` 就会在运行时被替换为 `Bonjour!` 了。

<!-- todo 暂不支持
TypeScript 用户请参考：[扩展全局属性](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />
-->

:::tip
请谨慎使用全局属性，如果在整个应用中使用不同插件注入的太多全局属性，很容易让应用变得难以理解和维护。
:::

### 插件中的 Provide / Inject <sup class="vt-badge dev-only" data-text="Reserved" /> {#provide-inject-with-plugins}

:::warning
请注意，这是一个预留的语法，当前版本未实现。

在插件中，我们可以通过 `provide` 来为插件用户供给一些内容。举例来说，我们可以将插件接收到的 `options` 参数提供给整个应用，让任何组件都能使用这个翻译字典对象。

```js{10}
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

现在，插件用户就可以在他们的组件中以 `i18n` 为 key 注入并访问插件的选项对象了。

<div class="composition-api">

```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>

:::
<!-- end revered_text -->
