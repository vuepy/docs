---
outline: deep
---

# 响应式基础 {#reactivity-fundamentals}

<div class="composition-api">

## 声明响应式状态 \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

推荐使用 [`ref()`](/api/reactivity-core#ref) 函数来声明响应式状态：

```python
from vuepy import ref

count = ref(0)
```

`ref()` 接收参数，并将其包裹在一个带有 `.value` 属性的 ref 对象中返回：

```python
count = ref(0)

print(count) # vuepy.vue.VueRef object at ...
print(count.value) # 0

count.value += 1
print(count.value) # 1
```

[//]: # (> 参考：[为 refs 标注类型]&#40;/guide/typescript/composition-api#typing-ref&#41; <sup class="vt-badge ts" />)

要在组件模板中访问 ref，请从组件的 `setup()` 函数中声明并返回它们：

```python{4,7}
from vuepy import ref

def setup(*args, **kwargs):
    count = ref(0)

    # 将 ref 暴露给模板
    return locals()
```

```vue-html
<div>{{ count.value }}</div>
```
<!-- todo 暂不支持
注意，在模板中使用 ref 时，我们**不**需要附加 `.value`。为了方便起见，当在模板中使用时，ref 会自动解包 (有一些[注意事项](#caveat-when-unwrapping-in-templates))。
-->

<!--
你也可以直接在事件监听器中改变一个 ref：

```vue-html{1}
<Button @click="count.value++">
  {{ count.value }}
</Button>
```
-->

对于更复杂的逻辑，我们可以在同一作用域内声明更改 ref 的函数，并将它们作为方法与状态一起公开：

```python{6-9,14}
from vuepy import ref

def setup(*args, **kwargs):
    count = ref(0)

    def increment(own):
      # 在 python 中需要 .value
      count.value += 1

    # 不要忘记同时暴露 increment 函数, 也可以直接返回 locals()
    return {
      "count": count,
      "increment": increment,
    }
```

然后，暴露的方法可以被用作事件监听器：

```vue-html{1}
<Button @click="increment" 
        :label="f'count {count.value}'">
</Button>
```

<!-- todo 暂不支持
这里是 [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo) 上的例子，没有使用任何构建工具。
-->

### `<script lang="py">` \*\* {#script-setup}

在 `setup()` 函数中手动暴露大量的状态和方法非常繁琐。幸运的是，我们可以通过使用[单文件组件 (SFC)](/guide/scaling-up/sfc) 来避免这种情况。我们可以使用 `<script lang="py">` 来大幅度地简化代码：

```vue{7-14}
<template>
  <Button @click="increment" 
          :label="f'count is {count.value}'">
  </Button>
</template>

<script lang="py">
from vuepy import ref

count = ref(0)

def increment(own):
    print(own)
    count.value += 1
    
</script>

```

<!-- todo 暂不支持
[在演练场中尝试一下](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)
-->

`<script lang="py">` 中的顶层的导入、声明的变量和函数可在同一组件的模板中直接使用。你可以理解为模板是在同一作用域内声明的一个 Python 函数——它自然可以访问与它一起声明的所有内容。

:::tip
在指南的后续章节中，我们基本上都会在组合式 API 示例中使用单文件组件 + `<script lang="py">` 的语法，因为大多数 Vue.py 开发者都会这样使用。

如果你没有使用单文件组件，你仍然可以在 [`setup()`](/api/composition-api-setup) 选项中使用组合式 API。
:::

### 为什么要使用 ref？ \*\* {#why-refs}

你可能会好奇：为什么我们需要使用带有 `.value` 的 ref，而不是普通的变量？为了解释这一点，我们需要简单地讨论一下 Vue.py 的响应式系统是如何工作的。

当你在模板中使用了一个 ref，然后改变了这个 ref 的值时，Vue.py 会自动检测到这个变化，并且相应地更新 DOM。这是通过一个基于依赖追踪的响应式系统实现的。当一个组件首次渲染时，Vue.py 会**追踪**在渲染过程中使用的每一个 ref。然后，当一个 ref 被修改时，它会**触发**追踪它的组件的一次重新渲染。

在标准的 Python 中，检测普通变量的访问或修改是行不通的。然而，我们可以通过 getter 和 setter 方法来拦截对象属性的 get 和 set 操作。

该 `.value` 属性给予了 Vue.py 一个机会来检测 ref 何时被访问或修改。在其内部，Vue.py 在它的 getter 中执行追踪，在它的 setter 中执行触发。从概念上讲，你可以将 ref 看作是一个像这样的对象：

```python
# 伪代码，不是真正的实现
class Ref:
    def __init__(self, value):
        self._value = value

    @property
    def value(self):
        track()
        return self._value

    @value.setter
    def value(self, val):
        self._value = val
        trigger()
```

另一个 ref 的好处是，与普通变量不同，你可以将 ref 传递给函数，同时保留对最新值和响应式连接的访问。当将复杂的逻辑重构为可重用的代码时，这将非常有用。

该响应性系统在[深入响应式原理](/guide/extras/reactivity-in-depth)章节中有更详细的讨论。
</div>

### 深层响应性 {#deep-reactivity}

<div class="composition-api">

Ref 可以持有任何类型的值，包括深层嵌套的对象、数组或者 Python 内置的数据结构，比如 `dict`。

Ref 会使它的值具有深层响应性。这意味着即使改变嵌套对象或数组时，变化也会被检测到：

```python
from vuepy import ref

obj = ref({
  'nested': { 'count': 0 },
  'arr': ['foo', 'bar']
})

def mutateDeeply():
    # 以下都会按照期望工作
    obj.value.nested.count += 1
    obj.value.arr.append('baz')
```

非原始值将通过 [`reactive()`](#reactive) 转换为响应式代理，该函数将在后面讨论。

也可以通过 [shallow ref](/api/reactivity-advanced#shallowref) 来放弃深层响应性。对于浅层 ref，只有 `.value` 的访问会被追踪。浅层 ref 可以用于避免对大型数据的响应性开销来优化性能、或者有外部库管理其内部状态的情况。

阅读更多：

- [减少大型不可变数据的响应性开销](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [与外部状态系统集成](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### DOM 更新时机 {#dom-update-timing}

当你修改了响应式状态时，DOM 会被自动更新。DOM 更新是同步的，Jupyter 会阻塞并等待更新完成，所以比较耗时的处理函数最好放到线程中异步执行。

```vue{21-23}
<template>
  <Button @click="async_run" :label="f'run {state.value}'"></Button>
</template>
<script setup>
import Button from "../../../src/ipywui/components/Button";
</script>

<script lang="py">
import time
import threading
from vuepy import ref

state = ref('')

def async_run(own):
    def task_block():
        state.value = 'start'
        time.sleep(2)
        state.value = 'finish'

    # task_block()
    thread = threading.Thread(target=task_block, args=())
    thread.start()
    
</script>

```

<!-- todo 暂不支持
当你修改了响应式状态时，DOM 会被自动更新。但是需要注意的是，DOM 更新不是同步的。Vue 会在“next tick”更新周期中缓冲所有状态的修改，以确保不管你进行了多少次状态修改，每个组件都只会被更新一次。

要等待 DOM 更新完成后再执行额外的代码，可以使用 [nextTick()](/api/general#nexttick) 全局 API：

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // 现在 DOM 已经更新了
}
```

-->

<div class="composition-api">

## `reactive()` \*\* {#reactive}

还有另一种声明响应式状态的方式，即使用 `reactive()` API。与将内部值包装在特殊对象中的 ref 不同，`reactive()` 将使对象本身具有响应性：

```python
from vuepy import reactive

state = reactive({'count': 0 })
```

<!-- todo 暂不支持
> 参考：[为 `reactive()` 标注类型](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />
-->

在模板中使用：

```vue-html
<p>
  {{ state.count }}
</p>
```

响应式对象是 Python 代理(类似 [Javascript Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy))，其行为就和普通对象一样。不同的是，Vue.py 能够拦截对响应式对象所有属性的访问和修改，以便进行依赖追踪和触发更新。

`reactive()` 将深层地转换对象：当访问嵌套对象时，它们也会被 `reactive()` 包装。当 ref 的值是一个对象时，`ref()` 也会在内部调用它。与浅层 ref 类似，这里也有一个 [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) API 可以选择退出深层响应性。

### Reactive Proxy vs. Original \*\* {#reactive-proxy-vs-original-1}

值得注意的是，`reactive()` 返回的是一个原始对象的 Proxy，它和原始对象是不相等的：

```python
raw = {}
proxy = reactive(raw)

# 代理对象和原始对象不是全等的
proxy is raw # False
```

只有代理对象是响应式的，更改原始对象不会触发更新。因此，使用 Vue.py 的响应式系统的最佳实践是**仅使用你声明对象的代理版本**。

为保证访问代理的一致性，对同一个原始对象调用 `reactive()` 会总是返回同样的代理对象，而对一个已存在的代理对象调用 `reactive()` 会返回其本身：

```python
# 在同一个对象上调用 reactive() 会返回相同的代理
reactive(raw) is proxy) # true

# 在一个代理上调用 reactive() 会返回它自己
reactive(proxy) is proxy # true
```

这个规则对嵌套对象也适用。依靠深层响应性，响应式对象内的嵌套对象依然是代理：

```python
proxy = reactive({})

raw = {}
proxy.nested = raw

proxy.nested is raw # false
```

### `reactive()` 的局限性 \*\* {#limitations-of-reactive}

`reactive()` API 有一些局限性：

1. **有限的值类型**：它只能用于可变类型 (对象、数组和如 `Map`、`Set` 这样的[可变类型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections))。它不能持有如 `string`、`int` 或 `boolean` 这样的[不可变类型](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)。

2. **不能替换整个对象**：由于 Vue.py 的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地“替换”响应式对象，因为这样的话与第一个引用的响应性连接将丢失：

   ```py
   state = reactive({ count: 0 })

   # 上面的 ({ count: 0 }) 引用将不再被追踪
   # (响应性连接已丢失！)
   state = reactive({ count: 1 })
   ```

<!-- todo 暂不支持
3. **对解构操作不友好**：当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接：

   ```js
   const state = reactive({ count: 0 })

   // 当解构时，count 已经与 state.count 断开连接
   let { count } = state
   // 不会影响原始的 state
   count++

   // 该函数接收到的是一个普通的数字
   // 并且无法追踪 state.count 的变化
   // 我们必须传入整个对象以保持响应性
   callSomeFunction(state.count)
   ```
-->

由于这些限制，我们建议使用 `ref()` 作为声明响应式状态的主要 API。

<!-- todo 暂不支持
## 额外的 ref 解包细节 \*\* {#additional-ref-unwrapping-details}

### 作为 reactive 对象的属性 \*\* {#ref-unwrapping-as-reactive-object-property}

一个 ref 会在作为响应式对象的属性被访问或修改时自动解包。换句话说，它的行为就像一个普通的属性：

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

如果将一个新的 ref 赋值给一个关联了已有 ref 的属性，那么它会替换掉旧的 ref：

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// 原始 ref 现在已经和 state.count 失去联系
console.log(count.value) // 1
```

只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为[浅层响应式对象](/api/reactivity-advanced#shallowreactive)的属性被访问时不会解包。

### 数组和集合的注意事项 \*\* {#caveat-in-arrays-and-collections}

与 reactive 对象不同的是，当 ref 作为响应式数组或原生集合类型 (如 `Map`) 中的元素被访问时，它**不会**被解包：

```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

### 在模板中解包的注意事项 \*\* {#caveat-when-unwrapping-in-templates}

在模板渲染上下文中，只有顶级的 ref 属性才会被解包。

在下面的例子中，`count` 和 `object` 是顶级属性，但 `object.id` 不是：

```js
const count = ref(0)
const object = { id: ref(1) }
```

因此，这个表达式按预期工作：

```vue-html
{{ count + 1 }}
```

...但这个**不会**：

```vue-html
{{ object.id + 1 }}
```

渲染的结果将是 `[object Object]1`，因为在计算表达式时 `object.id` 没有被解包，仍然是一个 ref 对象。为了解决这个问题，我们可以将 `id` 解构为一个顶级属性：

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

现在渲染的结果将是 `2`。

另一个需要注意的点是，如果 ref 是文本插值的最终计算值 (即 <code v-pre>{{ }}</code> 标签)，那么它将被解包，因此以下内容将渲染为 `1`：

```vue-html
{{ object.id }}
```

该特性仅仅是文本插值的一个便利特性，等价于 <code v-pre>{{ object.id.value }}</code>。

-->
</div>
