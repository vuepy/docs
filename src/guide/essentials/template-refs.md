# 模板引用 {#template-refs}

虽然 Vue.py 的声明性渲染模型为你抽象了大部分对 widget 的直接操作，但在某些情况下，我们仍然需要直接访问底层 widget 元素。要实现这一点，我们可以使用特殊的 `ref` attribute：

```vue-html
<Input ref="input"></Input>
```

`ref` 是一个特殊的 attribute，和 `v-for` 章节中提到的 `key` 类似。它允许我们在一个特定的 widget 元素或子组件实例被挂载后，获得对它的直接引用。这可能很有用，比如说在组件挂载时将焦点设置到一个 input 元素上，或在一个元素上初始化一个第三方库。

## 访问模板引用 {#accessing-the-refs}

<div class="composition-api">

为了通过组合式 API 获得该模板引用，我们需要声明一个匹配模板 ref attribute 值的 ref：

```vue
<template>
  <Input ref="input" /></Input>
</template>

<script lang='py'>
from vuepy import ref, onMounted

# 声明一个 ref 来存放该元素的引用
# 必须和模板里的 ref 同名
input = ref(null)

onMounted(lambda: input.value.focus())
</script>
```

</div>

注意，你只可以**在组件挂载后**才能访问模板引用。如果你想在模板中的表达式上访问 <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span>，在初次渲染时会是 <span class="options-api">`undefined`</span><span class="composition-api">`null`</span>。这是因为在初次渲染前这个元素还不存在呢！

<div class="composition-api">

如果你需要侦听一个模板引用 ref 的变化，确保考虑到其值为 `null` 的情况：

```py
@watchEffect
def focus():
  if input.value:
    input.value.focus()
  else:
    # 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
```

<!-- todo 暂不支持
也可参考：[为模板引用标注类型](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
-->

</div>

## `v-for` 中的模板引用 <sup class="vt-badge dev-only" data-text="Reserved" /> {#refs-inside-v-for}

:::warning
请注意，这是一个预留的语法，当前版本未实现。
:::

[//]: # (> 需要 v3.2.25 及以上版本)

<div class="composition-api">

当在 `v-for` 中使用模板引用时，对应的 ref 中包含的值是一个数组，它将在元素被挂载后包含对应整个列表的所有元素：

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

<!-- todo 暂不支持
[在演练场中尝试一下](https://play.vuejs.org/#eNpFjs1qwzAQhF9l0CU2uDZtb8UOlJ576bXqwaQyCGRJyCsTEHr3rGwnOehnd2e+nSQ+vW/XqMSH6JdL0J6wKIr+LK2evQuEhKCmBs5+u2hJ/SNjCm7GiV0naaW9OLsQjOZrKNrq97XBW4P3v/o51qTmHzUtd8k+e0CrqsZwRpIWGI0KVN0N7TqaqNp59JUuEt2SutKXY5elmimZT9/t2Tk1F+z0ZiTFFdBHs738Mxrry+TCIEWhQ9sttRQl0tEsK6U4HEBKW3LkfDA6o3dst3H77rFM5BtTfm/P)
-->

</div>

应该注意的是，ref 数组**并不**保证与源数组相同的顺序。

## 函数模板引用  <sup class="vt-badge dev-only" data-text="Reserved" /> {#function-refs}
:::warning
请注意，这是一个预留的语法，当前版本未实现。
:::

除了使用字符串值作名字，`ref` attribute 还可以绑定为一个函数，会在每次组件更新时都被调用。该函数会收到元素引用作为其第一个参数：

```vue-html
<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">
```

注意我们这里需要使用动态的 `:ref` 绑定才能够传入一个函数。当绑定的元素被卸载时，函数也会被调用一次，此时的 `el` 参数会是 `null`。你当然也可以绑定一个组件方法而不是内联函数。

## 组件上的 ref {#ref-on-component}

> 这一小节假设你已了解[组件](/guide/essentials/component-basics)的相关知识，或者你也可以先跳过这里，之后再回来看。

模板引用也可以被用在一个子组件上。这种情况下引用中获得的值是组件实例：

<div class="composition-api">

```vue
<template>
  <Child ref="child" />
</template>

<script lang='py'>
from vuepy impport ref, import_sfc

Child = import_sfc('./Child.vue')

# child.value 是 <Child /> 组件的实例
child = ref(null)
</script>
```

</div>

<div class="composition-api">

有一个例外的情况，使用了 `<script setup>` 的组件是**默认私有**的：一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 `defineExpose` 宏显式暴露：

:::warning
请注意，这是一个预留的语法，当前版本未实现。
:::

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// 像 defineExpose 这样的编译器宏不需要导入
defineExpose({
  a,
  b
})
</script>
```

当父组件通过模板引用获取到了该组件的实例时，得到的实例类型为 `{ a: number, b: number }` (ref 都会自动解包，和一般的实例一样)。

<!-- todo 暂不支持
TypeScript 用户请参考：[为组件的模板引用标注类型](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />
-->

</div>

