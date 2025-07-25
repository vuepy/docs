# 组件基础 {#components-basics}

组件允许我们将 UI 划分为独立的、可重用的部分，并且可以对每个部分进行单独的思考。在实际应用中，组件常常被组织成层层嵌套的树状结构：

![组件树](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

这和我们嵌套 HTML 元素的方式类似，Vue.py 实现了自己的组件模型，使我们可以在每个组件内封装自定义内容与逻辑。Vue.py 同样也能很好地配合原生 Web Component。如果你想知道 Vue.py 组件与原生 Web Components 之间的关系，可以[阅读此章节](/guide/extras/web-components)。

## 定义一个组件 {#defining-a-component}

我们一般会将 Vue.py 组件定义在一个单独的 `.vue` 文件中，这被叫做[单文件组件](/guide/scaling-up/sfc) (简称 SFC)：

<div class="composition-api">

```vue
<template>
  <Button @click="inc()" 
          :label='f"You clicked me {count.value } times."'
  ></Button>
</template>

<script lang='py'>
from vuepy import ref

count = ref(0)

def inc():
  count.value += 1
  
</script>
```

</div>

一个 Vue.py 组件也可以一个包含特定选项的 Python 字典来定义：

<div class="composition-api">

```py
# comp.py
from vuepy import ref, VueOptions

def setup(*args):
    count = ref(0)
    
    def inc():
        count.value += 1
    
    return locals()
    

Comp = VueOptions(**{
    'setup': setup,
    'template': '''
      <Button @click=inc() label='click'></Button>
      <p>You clicked me {{ count.value }} times.</p>
    ''',
})
```

</div>

这里的模板是一个内联的 Python 字符串，Vue.py 将会在运行时编译它。

<!-- todo 暂不支持
你也可以使用 ID 选择器来指向一个元素 (通常是原生的 `<template>` 元素)，Vue.py 将会使用其内容作为模板来源。
上面的例子中定义了一个组件，并在一个 `.js` 文件里默认导出了它自己，但你也可以通过具名导出在一个文件中导出多个组件。
-->

上面的例子中定义了一个组件，并通过 `Comp` 变量默认导出了它自己，可通过如下方式使该组件：

```Vue
<template>
  <Comp></Comp>
</template>
<scirpt lang='py'>
from comp import Comp
</scirpt>

```

## 使用组件 {#using-a-component}

:::tip
我们会在接下来的指引中使用 SFC 语法。
:::

要使用一个子组件，我们需要在父组件中导入它。假设我们把计数器组件放在了一个叫做 `ButtonCounter.vue` 的文件中，这个组件将会以默认导出的形式被暴露给外部。

<div class="composition-api">

```vue
<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter></ButtonCounter>
</template>

<script lang='py'>
from vuepy import import_sfc
ButtonCounter = import_sfc('./ButtonCounter.vue')
</script>
```

通过 `<script lang='py'>`，导入的组件都在模板中直接可用。

</div>

当然，你也可以全局地注册一个组件，使得它在当前应用中的任何组件上都可以使用，而不需要额外再导入。关于组件的全局注册和局部注册两种方式的利弊，我们放在了[组件注册](/guide/components/registration)这一章节中专门讨论。

组件可以被重用任意多次：

```vue-html
<h1>Here is a child component!</h1>
<ButtonCounter><ButtonCounter/>
<ButtonCounter><ButtonCounter/>
<ButtonCounter><ButtonCounter/>
```

<!-- todo 暂不支持
<div class="composition-api">

[在演练场中尝试一下](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)

</div>
-->

你会注意到，每当点击这些按钮时，每一个组件都维护着自己的状态，是不同的 `count`。这是因为每当你使用一个组件，就创建了一个新的**实例**。

在单文件组件中，推荐为子组件使用 `PascalCase` 的标签名，以此来和原生的 HTML 元素作区分。虽然原生 HTML 标签名是不区分大小写的，但 Vue.py 单文件组件是可以在编译中区分大小写的, 并显式地关闭这些组件的标签。

如果你是直接在 DOM 中书写模板 (例如原生 `<template>` 元素的内容)，模板的编译需要遵从浏览器中 HTML 的解析行为。在这种情况下，你应该需要使用 `kebab-case` 形式并显式地关闭这些组件的标签。

```vue-html
<!-- 如果是在 DOM 中书写该模板 -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

请看 [DOM 内模板解析注意事项](#in-dom-template-parsing-caveats)了解更多细节。

## 传递 props {#passing-props}

如果我们正在构建一个博客，我们可能需要一个表示博客文章的组件。我们希望所有的博客文章分享相同的视觉布局，但有不同的内容。要实现这样的效果自然必须向组件中传递数据，例如每篇文章标题和内容，这就会使用到 props。

Props 是一种特别的 attributes，你可以在组件上声明注册。要传递给博客文章组件一个标题，我们必须在组件的 props 列表上声明它。这里要用到 <span class="options-api">[`props`](/api/options-state#props) 选项</span><span class="composition-api">[`defineProps`](/api/sfc-script-setup#defineprops-defineemits)</span>：

<div class="options-api">

```vue
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

当一个值被传递给 prop 时，它将成为该组件实例上的一个属性。该属性的值可以像其他组件属性一样，在模板和组件的 `this` 上下文中访问。

</div>
<div class="composition-api">

```vue
<!-- BlogPost.vue -->
<template>
  <h4>{{ props.title.value }}</h4>
</template>

<script lang='py'>
from vuepy import defineProps

props = defineProps(['title'])
</script>
```

<!-- todo 暂不支持
`defineProps` 是一个仅 `<script setup>` 中可用的编译宏命令，并不需要显式地导入。声明的 props 会自动暴露给模板。
-->

`defineProps` 会返回一个对象，其中包含了可以传递给组件的所有 props：

```py
props = defineProps(['title'])
print(props.title.value)
```

<!-- todo 暂不支持
TypeScript 用户请参考：[为组件 props 标注类型](/guide/typescript/composition-api#typing-component-props)<sup class="vt-badge ts" />

如果你没有使用 `<script setup>`，props 必须以 `props` 选项的方式声明，props 对象会作为 `setup()` 函数的第一个参数被传入：

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```
-->

</div>

一个组件可以有任意多的 props，默认情况下，所有 prop 都接受任意类型的值。

当一个 prop 被注册后，可以像这样以自定义 attribute 的形式传递数据给它：

```vue-html
<BlogPost title="My journey with Vue.py"></BlogPost>
<BlogPost title="Blogging with Vue.py"></BlogPost>
<BlogPost title="Why Vue.py is so fun"></BlogPost>
```

在实际应用中，我们可能在父组件中会有如下的一个博客文章数组：

<div class="composition-api">

```py
posts = ref([
  { 'id': 1, 'title': 'My journey with Vue.py' },
  { 'id': 2, 'title': 'Blogging with Vue.py' },
  { 'id': 3, 'title': 'Why Vue.py is so fun' }
])
```

</div>

这种情况下，我们可以使用 `v-for` 来渲染它们：

```vue-html
<BlogPost
  v-for="post in posts.value"
  :key="post.id"
  :title="post.title"
></BlogPost>
```

<!-- todo 暂不支持
<div class="composition-api">

[在演练场中尝试一下](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>
-->

留意我们是如何使用 `v-bind` 来传递动态 prop 值的。当事先不知道要渲染的确切内容时，这一点特别有用。

以上就是目前你需要了解的关于 props 的全部了。如果你看完本章节后还想知道更多细节，我们推荐你深入阅读关于 props 的[完整指引](/guide/components/props)。

## 监听事件 {#listening-to-events}

让我们继续关注我们的 `<BlogPost>` 组件。我们会发现有时候它需要与父组件进行交互。例如，要在此处实现无障碍访问的需求，将博客文章的文字能够放大，而页面的其余部分仍使用默认字号。

在父组件中，我们可以添加一个 `postFontSize` <span class="options-api">数据属性</span><span class="composition-api">ref </span>来实现这个效果：

<div class="composition-api">

```py{5}
posts = ref([
  # /* ... */
])

postFontSize = ref(1)
```

</div>

用它来控制所有博客文章的字体大小：

```vue-html{4}
<div>
  <BlogPost
    v-for="post in posts.value"
    :font_size="postFontSize.value"
    :key="post.id"
    :title="post.title"
   />
</div>
```

然后，给 `<BlogPost>` 组件添加一个按钮：

```vue{7}
<!-- BlogPost.vue -->
<template>
  <VBox>
    <Label :style="f'font-size: {props.font_size.value}px'" 
           :value="f'{props.title.value}'"> 
    </Label>
    <Button @click="emit_enlarge()" label="Enlarge text">
    </Button>
  </VBox>
</template>
<script lang='py'>
from vuepy import defineProps, defineEmits
props = defineProps(['title', 'font_size'])
emits = defineEmits(['enlarge-text'])

def emit_enlarge():
  emits("enlarge-text")
</script>
```

我们想要点击这个按钮来告诉父组件它应该放大所有博客文章的文字。要解决这个问题，组件实例提供了一个自定义事件系统。父组件可以通过 `v-on` 或 `@` 来选择性地监听子组件上抛的事件，就像监听原生 DOM 事件那样：

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="enlarge_text()"
 />
 <script lang='py'>
 ...
 def enlarge_text():
   postFontSize.value += 0.1
 ...
 </script>
```

子组件可以通过调用定义的 **`emits`** 对象，通过传入事件名称来抛出一个事件：

```vue{7,17}
<!-- BlogPost.vue -->
<template>
  <VBox>
    <Label :style="f'font-size: {props.font_size.value}px'" 
           :value="f'{props.title.value}'"> 
    </Label>
    <Button @click="emit_enlarge()" label="Enlarge text">
    </Button>
  </VBox>
</template>
<script lang='py'>
from vuepy import defineProps, defineEmits
props = defineProps(['title', 'font_size'])
emits = defineEmits(['enlarge-text'])

def emit_enlarge():
  emits("enlarge-text")
</script>
```

因为有了 `@enlarge-text="enlarge_text()"` 的监听，父组件会接收这一事件，从而更新 `postFontSize` 的值。

<!-- todo 暂不支持
<div class="composition-api">

[在演练场中尝试一下](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>
-->

我们可以通过 <span class="composition-api">[`defineEmits`](/api/sfc-script-setup#defineprops-defineemits) </span>来声明需要抛出的事件：

<div class="composition-api">

```vue{14}
<!-- BlogPost.vue -->
<template>
  <VBox>
    <Label :style="f'font-size: {props.font_size.value}px'" 
           :value="f'{props.title.value}'"> 
    </Label>
    <Button @click="emit_enlarge()" label="Enlarge text">
    </Button>
  </VBox>
</template>
<script lang='py'>
from vuepy import defineProps, defineEmits
props = defineProps(['title', 'font_size'])
emits = defineEmits(['enlarge-text'])

def emit_enlarge():
  emits("enlarge-text")
</script>
```

</div>

这声明了一个组件可能触发的所有事件，还可以对事件的参数进行[验证](/guide/components/events#validate-emitted-events)。同时，这还可以让 Vue.py 避免将它们作为原生事件监听器隐式地应用于子组件的根元素。

<div class="composition-api">

和 `defineProps` 类似，`defineEmits` 仅可用于 `<script lang='py'>` 之中，它返回一个`emits` 对象。它可以被用于在组件的 `<script lang='py'>` 中抛出事件：

```vue{14}
<!-- BlogPost.vue -->
<template>
  <VBox>
    <Label :style="f'font-size: {props.font_size.value}px'" 
           :value="f'{props.title.value}'"> 
    </Label>
    <Button @click="emit_enlarge()" label="Enlarge text">
    </Button>
  </VBox>
</template>
<script lang='py'>
from vuepy import defineProps, defineEmits
props = defineProps(['title', 'font_size'])
emits = defineEmits(['enlarge-text'])

def emit_enlarge():
  emits("enlarge-text")
</script>
```

<!-- todo 暂不支持
TypeScript 用户请参考：[为组件 emits 标注类型](/guide/typescript/composition-api#typing-component-emits)<sup class="vt-badge ts" />

如果你没有在使用 `<script setup>`，你可以通过 `emits` 选项定义组件会抛出的事件。你可以从 `setup()` 函数的第二个参数，即 setup 上下文对象上访问到 `emit` 函数：

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```
-->

</div>

以上就是目前你需要了解的关于组件自定义事件的所有知识了。如果你看完本章节后还想知道更多细节，请深入阅读[组件事件](/guide/components/events)章节。

## 通过插槽来分配内容 {#content-distribution-with-slots}

一些情况下我们会希望能和 HTML 元素一样向组件中传递内容：

```vue-html
<AlertBox>
  <p>Something bad happened.</p>
</AlertBox>
```

我们期望能渲染成这样：

:::danger This is an Error for Demo Purposes
Something bad happened.
:::

这可以通过 Vue.py 的自定义 `<slot>` 元素来实现：

```vue{4}
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
    <slot></slot>
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

如上所示，我们使用 `<slot>` 作为一个占位符，父组件传递进来的内容就会渲染在这里。

<!-- todo 暂不支持
<div class="composition-api">

[在演练场中尝试一下](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)

</div>
-->

以上就是目前你需要了解的关于插槽的所有知识了。如果你看完本章节后还想知道更多细节，请深入阅读[组件插槽](/guide/components/slots)章节。

## 动态组件 <sup class="vt-badge dev-only" data-text="Reserved" /> {#dynamic-components}

:::warning
请注意，这是一个预留的语法，当前版本未实现。
:::

有些场景会需要在两个组件间来回切换，比如 Tab 界面：

<div class="options-api">

[在演练场中查看示例](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[在演练场中查看示例](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

</div>

上面的例子是通过 Vue.py 的 `<component>` 元素和特殊的 `is` attribute 实现的：

<div class="options-api">

```vue-html
<!-- currentTab 改变时组件也改变 -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```vue-html
<!-- currentTab 改变时组件也改变 -->
<component :is="tabs[currentTab]"></component>
```

</div>

在上面的例子中，被传给 `:is` 的值可以是以下几种：

- 被注册的组件名
- 导入的组件对象

你也可以使用 `is` attribute 来创建一般的 HTML 元素。

当使用 `<component :is="...">` 来在多个组件间作切换时，被切换掉的组件会被卸载。我们可以通过 [`<KeepAlive>` 组件](/guide/built-ins/keep-alive)强制被切换掉的组件仍然保持“存活”的状态。

## DOM 内模板解析注意事项 {#in-dom-template-parsing-caveats}

如果你想在 DOM 中直接书写 Vue.py 模板，Vue.py 则必须从 DOM 中获取模板字符串。由于浏览器的原生 HTML 解析行为限制，有一些需要注意的事项。

:::tip
请注意下面讨论只适用于直接在 DOM 中编写模板的情况。如果你使用来自以下来源的字符串模板，就不需要顾虑这些限制了：

- 单文件组件
- 内联模板字符串 (例如 `template: '...'`)
- `<script type="text/x-template">`
:::

### 大小写区分 {#case-insensitivity}

HTML 标签和属性名称是不分大小写的，所以浏览器会把任何大写的字符解释为小写。这意味着当你使用 DOM 内的模板时，无论是 PascalCase 形式的组件名称、camelCase 形式的 prop 名称还是 v-on 的事件名称，都需要转换为相应等价的 kebab-case (短横线连字符) 形式：

```js
// JavaScript 中的 camelCase
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- HTML 中的 kebab-case -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### 闭合标签 {#self-closing-tags}

我们在上面的例子中已经使用过了闭合标签 (self-closing tag)：

```vue-html
<MyComponent />
```

这是因为 Vue.py 的模板解析器支持任意标签使用 `/>` 作为标签关闭的标志。

然而在 DOM 内模板中，我们必须显式地写出关闭标签：

```vue-html
<my-component></my-component>
```

这是由于 HTML 只允许[一小部分特殊的元素](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)省略其关闭标签，最常见的就是 `<input>` 和 `<img>`。对于其他的元素来说，如果你省略了关闭标签，原生的 HTML 解析器会认为开启的标签永远没有结束，用下面这个代码片段举例来说：

```vue-html
<my-component /> <!-- 我们想要在这里关闭标签... -->
<span>hello</span>
```

将被解析为：

```vue-html
<my-component>
  <span>hello</span>
</my-component> <!-- 但浏览器会在这里关闭标签 -->
```

### 元素位置限制 {#element-placement-restrictions}

当前原生 HTML 元素中不支持嵌套自定义组件，例如 `div` 中不能放置 `Input` 等自定义组件，可以使用 `VBox` 或 `HBox` 替代 div 作为一种解决方案。

```vue-html
<!-- 错误 -->
<div>
  <Input></Input>
</div>

<!-- 正确 -->
<VBox>
  <Input></Input>
</VBox>
```

某些 HTML 元素对于放在其中的元素类型有限制，例如 `<ul>`，`<ol>`，`<table>` 和 `<select>`，相应的，某些元素仅在放置于特定元素中时才会显示，例如 `<li>`，`<tr>` 和 `<option>`。

这将导致在使用带有此类限制元素的组件时出现问题。例如：

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

自定义的组件 `<blog-post-row>` 将作为无效的内容被忽略，因而在最终呈现的输出中造成错误。我们可以使用特殊的 [`is` attribute](/api/built-in-special-attributes#is) 作为一种解决方案：

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
当使用在原生 HTML 元素上时，`is` 的值必须加上前缀 `vue:` 才可以被解析为一个 Vue.py 组件。这一点是必要的，为了避免和原生的[自定义内置元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)相混淆。
:::

以上就是你需要了解的关于 DOM 内模板解析的所有注意事项，同时也是 Vue.py *基础*部分的所有内容。祝贺你！虽然还有很多需要学习的，但你可以先暂停一下，去用 Vue.py 做一些有趣的东西
<!-- todo 暂不支持
，或者研究一些[示例](/examples/)。
-->

完成了本页的阅读后，回顾一下你刚才所学到的知识，如果还想知道更多细节，我们推荐你继续阅读关于组件的完整指引。

<!-- zhlint ignore: Something bad happened. -->
