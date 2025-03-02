---
footer: false
---

# 集成 anywidget

## 简单示例

示例演示与 anywidget 组件进行状态同步，并实现事件机制。

```vue
<template>
  <p>count: {{ count.value }}</p>
  <Counter v-model="count.value" @btn2_click=reset></Counter>
</template>

<script lang="py">
import anywidget
import traitlets

from vuepy import ref, VueComponent, defineEmits

# 使用anywidget开发Widget
class CounterWidget(anywidget.AnyWidget):
    _esm = """
    function render({ model, el }) {
      let count = () => model.get("value");
      // btn1为双向绑定的方式
      let btn1 = document.createElement("button");
      btn1.classList.add("counter-button");
      btn1.innerHTML = `btn1: count is ${count()}`;
      // btn1接收click事件时更新value值
      btn1.addEventListener("click", () => {
        model.set("value", count() + 1);
        model.save_changes();
      });
      // 接收value值的变化，并更新btn1的值
      model.on("change:value", () => {
        btn1.innerHTML = `btn1: count is ${count()}`;
      });
      el.appendChild(btn1);

      // btn2为事件通知方式
      let btn2 = document.createElement("button");
      btn2.classList.add("counter-button");
      btn2.innerHTML = `btn2`;
      let keep_change = 0;
      // btn2接收btn2_click事件并更新event的值
      btn2.addEventListener("click", () => {
        const btn2_event = "btn2_click"
        keep_change += 1; // 每次点击更新值以保证触发event值的更新
        model.set("event", {"event": btn2_event, "payload": keep_change});
        model.save_changes();
      });
      el.appendChild(btn2);
    }
    export default { render };
    """
    _css = """
    .counter-button {
      background-image: linear-gradient(to right, #a1c4fd, #c2e9fb);
      border: 0;
      border-radius: 10px;
      padding: 10px 50px;
      color: white;
    }
    """
    value = traitlets.Int(0).tag(sync=True) # 用于双向同步
    event = traitlets.Dict().tag(sync=True) # 用于事件机制


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # 通过观察event值的变化来模拟事件监听机制
        self.observe(self._on_event, ['event'])
        # Counter组件注册监听事件btn2_click
        self.emits = defineEmits(['btn2_click'])

    def on_btn2_click(self, callback, remove=False):
        '''btn2_click事件回调注册函数'''
        self.emits.add_event_listener('btn2_click', callback, remove)

    def _on_event(self, change):
        '''事件分发函数'''
        event = change.get("new", {})
        # 获取event字段来确定事件类型
        ev = event.get("event")
        payload = event.get("payload")
        # 使用emits触发对应事件类型
        self.emits(ev, payload)

# 集成CounterWidget
class Counter(VueComponent):
    def render(self, ctx, props, setup_returned):
        attrs = ctx.get('attrs', {})
        return CounterWidget(**props, **attrs)

count = ref(0)

def reset(payload):
    count.value = 0
    print(payload) # 1, 2, 3
</script>
```

## 实现container类型的组件

实现 container 类型的组件并集成 ipywui 组件 Button。

```vue
<template>
  <Container>
    <Button label="btn"></Button>
  </Container>
</template>

<script lang="py">
import anywidget
import traitlets
import ipywidgets as widgets

from vuepy import ref, VueComponent

# 使用anywidget开发Widget
class ContainerWidget(anywidget.AnyWidget):
    _esm = """
    async function unpack_models(model_ids, manager) {
      return Promise.all(
        model_ids.map(id => manager.get_model(id.slice("IPY_MODEL_".length)))
      );
    }
    export async function render(view) {
      let model = view.model;
      let el = view.el;
      let div = document.createElement("div");
      div.innerHTML = `<p>hello world</p>`;

      // 将子组件添加到父组件中
      let model_ids = model.get("children"); /* ["IPY_MODEL_{model_id>}", ...] */
      let children_models = await unpack_models(model_ids, model.widget_manager);
      for (let model of children_models) {
        let child_view = await model.widget_manager.create_view(model);
        div.appendChild(child_view.el);
      }

      el.appendChild(div);
    }
    """
    # slot
    children = traitlets.List(trait=traitlets.Instance(widgets.DOMWidget)) \
        .tag(sync=True, **widgets.widget_serialization)

# 集成ContainerWidget
class Container(VueComponent):
    def render(self, ctx, props, setup_returned):
        attrs = ctx.get('attrs', {})
        slots = ctx.get('slots', {})
        # 从slot中取出子组件并赋值给children
        return ContainerWidget(children=slots.get('default', []), **props, **attrs)

</script>
```
