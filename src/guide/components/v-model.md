# 组件 v-model {#component-v-model}

## 基本用法 {#basic-usage}

`v-model` 可以在组件上使用以实现双向绑定。

<div class="composition-api">

推荐的实现方式是使用 [`defineModel()`](/api/sfc-script-setup#definemodel) ：

```vue
<!-- Child.vue -->
<template>
  <div>parent bound v-model is: {{ model.value }}</div>
</template>

<script lang='py'>
from vuepy import defineModel

model = defineModel()

def update():
    model.value += 1
    
</script>
```

父组件可以用 `v-model` 绑定一个值：

```vue-html
<!-- Parent.vue -->
<Child v-model="count.value"></Child>
```

`defineModel()` 返回的值是一个 ref。它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用：

- 它的 `.value` 和父组件的 `v-model` 的值同步；
- 当它被子组件变更了，会触发父组件绑定的值一起更新。

<!-- todo 暂不支持
这意味着你也可以用 `v-model` 把这个 ref 绑定到一个原生 input 元素上，在提供相同的 `v-model` 用法的同时轻松包装原生 input 元素：

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

[演练场示例](https://play.vuejs.org/#eNqFUtFKwzAU/ZWYl06YLbK30Q10DFSYigq+5KW0t11mmoQknZPSf/cm3eqEsT0l555zuefmpKV3WsfbBuiUpjY3XDtiwTV6ziSvtTKOLNZcFKQ0qiZRnATkG6JB0BIDJen2kp5iMlfSOlLbisw8P4oeQAhFPpURxVV0zWSa9PNwEgIHtRaZA0SEpOvbeduG5q5LE0Sh2jvZ3tSqADFjFHlGSYJkmhz10zF1FseXvIo3VklcrfX9jOaq1lyAedGOoz1GpyQwnsvQ3fdTqDnTwPhQz9eQf52ob+zO1xh9NWDBbIHRgXOZqcD19PL9GXZ4H0h03whUnyHfwCrReI+97L6RBdo+0gW3j+H9uaw+7HLnQNrDUt6oV3ZBzyhmsjiz+p/dSTwJfUx2+IpD1ic+xz5enwQGXEDJJaw8Gl2I1upMzlc/hEvdOBR6SNKAjqP1J6P/o6XdL11L5h4=)
-->

### 底层机制 {#under-the-hood}

编译器将 `defineModel` 展开为以下内容：

- 一个名为 `value` 的 prop，本地 ref 的值与其同步；
- 一个名为 `update:value` 的事件，当本地 ref 的值发生变更时触发。

<!-- todo 暂不支持
因为 `defineModel` 声明了一个 prop，你可以通过给 `defineModel` 传递选项，来声明底层 prop 的选项：

```js
// 使 v-model 必填
const model = defineModel({ required: true })

// 提供一个默认值
const model = defineModel({ default: 0 })
```

:::warning
如果为 `defineModel` prop 设置了一个 `default` 值且父组件没有为该 prop 提供任何值，会导致父组件与子组件之间不同步。在下面的示例中，父组件的 `myRef` 是 undefined，而子组件的 `model` 是 1：

```js
// 子组件：
const model = defineModel({ default: 1 })

// 父组件
const myRef = ref()
```

```html
<Child v-model="myRef"></Child>
```

:::
-->

</div>


## `v-model` 的参数 {#v-model-arguments}

组件上的 `v-model` 也可以接受一个参数：

```vue-html
<MyComponent v-model:title="bookTitle.value"></MyComponent>
```

<div class="composition-api">

在子组件中，我们可以通过将字符串作为第一个参数传递给 `defineModel()` 来支持相应的参数：

```vue
<!-- MyComponent.vue -->
<template>
  <Input type="text" v-model="title.value"></Input>
</template>

<script lang='py'>
from vuepy import defineModel

title = defineModel('title')
</script>
```

<!-- todo 暂不支持
[在演练场中尝试一下](https://play.vuejs.org/#eNqFkl9PwjAUxb9K05dhglsMb2SQqOFBE9Soj31Zxh0Uu7bpHxxZ9t29LWOiQXzaes7p2a+9a+mt1unOA53S3JaGa0csOK/nTPJaK+NISwxUpCOVUTVJMJoM1nJ/r/BNgnS9nWYnWujFMCFMlkpaRxx3AsgsFI6S3XWtViBIYda+Dg3QFLUWkFwxmWcHFqTAhQPUCwe4IiTf3Mzbtq/qujzDddRPYfruaUzNGI1PRkmG0Twb+uiY/sI9cw0/0VdQcQnL0D5KovgfL5fa4/69jiDQOOTo+S6SOYtfrvg63VolkauNN0lLxOUCzLN2HMkYnZLoBK8QQn0+Rs0ZD+OjXm6g/Dijb20TNEZfDFgwOwQZPIdzAWQN9uLtKXIPJtL7gH3BfAWrhA+Mh9idlyvEPslF2of4J3G5freLxoG0x0MF0JDsYp5RHE6Y1F9H/8adpJO4j8mOdl/Hw/nf)

如果需要额外的 prop 选项，应该在 model 名称之后传递：

```js
const title = defineModel('title', { required: true })
```
-->

</div>


## 多个 `v-model` 绑定 {#multiple-v-model-bindings}

利用刚才在 [`v-model` 参数](#v-model-arguments)小节中学到的指定参数与事件名的技巧，我们可以在单个组件实例上创建多个 `v-model` 双向绑定。

组件上的每一个 `v-model` 都会同步不同的 prop，而无需额外的选项：

```vue-html
<UserName
  v-model:first_name="first.value"
  v-model:last_name="last.value"
></UserName>
```

<div class="composition-api">

```vue
<template>
  <Input type="text" v-model="firstName.value"></Input>
  <Input type="text" v-model="lastName.value"></Input>
</template>

<script lang='py'>
from vuepy import defineModel

firstName = defineModel('first_name')
lastName = defineModel('last_name')
</script>
```

<!-- todo 暂不支持
[在演练场中尝试一下](https://play.vuejs.org/#eNqFkstuwjAQRX/F8iZUAqKKHQpIfbAoUmnVx86bKEzANLEt26FUkf+9Y4MDSAg2UWbu9fjckVv6oNRw2wAd08wUmitLDNhGTZngtZLakpZoKIkjpZY1SdCadNK3Ab3IazhowzQ2/ES0MVFIYSwpucbvxA/qJXO5FsldlKr8qDxL8EKW7kEQAQsLtapyC1gRkq3vp217mOccwf8wwLksRSlYIoMvCNkOarmEahyODAT2J4yGgtFzhx8UDf5/r6c4NEs7CNqnpxkvbO0kcVjNhCyh5AJe/SW9pBPOV3DJGvu3dsKFaiyxf8qTW9gheQwVs4Z90BDm5oF47cF/Ht4aZC75argxUmD61g9ktJC14hXoN2U5ZmJ0TILitbyq5O889KxuoB/7xRqKnwv9jdn5HqPvGnDVWwTpNJvrFSCul2efi4DeiRigqdB9RfwAI6vGM+5tj41YIvaJL9C+hOfNxerLzHYWhImhPKh3uuBnFJ/A05XoR9zRcBTOMeGo+wcs+yse)
-->

</div>


## 处理 `v-model` 修饰符 <sup class="vt-badge dev-only" data-text="Reserved" /> {#handling-v-model-modifiers}

:::warning
请注意，这是一个预留的语法，当前版本未实现。

在学习输入绑定时，我们知道了 `v-model` 有一些[内置的修饰符](/guide/essentials/forms#modifiers)，例如 `.trim`，`.number` 和 `.lazy`。在某些场景下，你可能想要一个自定义组件的 `v-model` 支持自定义的修饰符。

我们来创建一个自定义的修饰符 `capitalize`，它会自动将 `v-model` 绑定输入的字符串值第一个字母转为大写：

```vue-html
<MyComponent v-model.capitalize="myText" />
```

<div class="composition-api">

通过像这样解构 `defineModel()` 的返回值，可以在子组件中访问添加到组件 `v-model` 的修饰符：

```vue{4}
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

为了能够基于修饰符选择性地调节值的读取和写入方式，我们可以给 `defineModel()` 传入 `get` 和 `set` 这两个选项。这两个选项在从模型引用中读取或设置值时会接收到当前的值，并且它们都应该返回一个经过处理的新值。下面是一个例子，展示了如何利用 `set` 选项来应用 `capitalize` (首字母大写) 修饰符：

```vue{6-8}
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9UsFu2zAM/RVClzhY5mzoLUgHdEUPG9Bt2LLTtIPh0Ik6WxIkyosb5N9LybFrFG1OkvgeyccnHsWNtXkbUKzE2pdOWQKPFOwnqVVjjSM4gsMKTlA508CMqbMRuu9uDd80ajrD+XISi3WZDCB1abQnaLoNHgiuY8VsNptLvV72TbkdPwgbWxeE/ALY7JUHpW0gKAurqKjVI3rAFl1He6V30JkA3AbdKvLXUzXt+8Zssc6fM6+l6NtLAUtusF6O3cRCvFB9yY2SiYFw+8KSYcY/qfEC+FCVQuf/8rxbrJTG+4hkxyiWq2ZtUQecQ3oDqAqyMWeieyQAu0bBaUh5ebkv3A1lH+Y5md/WorstPGZzeHfGfa1KzD6yxzH11B/TCjHC4dPlX1j3P0CdjQ5S79/Z3WhpPF91lDz7Uald/uCNZj/TFFJE91SN7rslxX5JsRrmk6Koa/P/a4qRC7gY4uUey3+vxB/8Icak+OHQo2tRihGjwu2QtUb47te3pHsEWXWomX0B/Ine1CFq7Gmfg96y7Akvqf2StoKXcePvDoTaD0NFocnhxJeClyRu2FujP8u9yq+GnxGnJxSEO+M=)

</div>

### 带参数的 `v-model` 修饰符 {#modifiers-for-v-model-with-arguments}

这里是另一个例子，展示了如何在使用多个不同参数的 `v-model` 时使用修饰符：

```vue-html
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true}
</script>
```

</div>
:::
<!-- end revered_text -->
