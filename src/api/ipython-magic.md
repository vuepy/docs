# IPython Magic

要使用这些魔法方法，您必须先注册它们。在 Jupyter 中运行 `%load_ext`。

```
%load_ext vuepy
```

## %vuepy_import {#vuepy_import}

在 IPython 中导入 SFC。

- **类型**
  ```py
  %vuepy_import sfc_file
  ```

- **示例**

  ```py
  from vuepy import create_app
  from vuepy.utils import magic

  # 导入 test.vue 组件
  App=%vuepy_import test.vue
  
  app = create_app(App)
  app.mount()
  ```

## %%vuepy_import {#vuepy_import_cell}

在 IPython 中导入 SFC，并赋值给名为 `component_name` 的变量。

- **类型**
  ```py
  %%vuepy_import component_name
  sfc_content
  ```

- **示例**

  ```py
  %%vuepy_import Component1
  <template>
    <Button description="add"
            button_style="info"
    ></Button>
  </template>
  ```

  如果需要访问当前jupyter笔记本中的变量可以通过以下方式

  ```python
  # --- cell 1 ---
  a = 1
  # --- cell 2 ---
  %%vuepy_import A
  <template>
    <p>{{ a }}</p>
  </template>
  <script lang='py'>
  from IPython import get_ipython
  # 获取jupyter笔记本中的变量
  locals().update(get_ipython().user_ns)
  </script>
  ```

## %vuepy_run {#vuepy_run}

在 IPython 中运行 Vuepy 应用, `vue_file` 为 vue 文件。

- **类型**
  ```py
  %vuepy_run vue_file
  ```

- **示例 1**

  ```py
  %vuepy_run app.vue
  ```

-----

也可以运行已导入的组件。

- **类型**
  ```py
  %vuepy_run $$Component
  ```

- **示例 2**

  ```py
  from vuepy import import_sfc
  Component = import_sfc("component.vue")

  # ----------------------
  %vuepy_run $$Component
  ```

-----
指定使用的插件，获取 app 对象

- **类型**
  ```py
  %vuepy_run vue_file  --plugins plugin1 plugin2 --app app1
  ```

  * `--plugins`: 可选参数，指定 app 使用的插件
  * `--app`: 可选参数，将的 App 对象赋值给指定的变量

- **示例 3**

  ```py
  from ipywui import wui
  %vuepy_run app.vue --plugin wui --app app1
  ```

  ```py
  print(app1)  # App at 0x100000000
  ```

## %%vuepy_run {#vuepy_run_cell}

在 IPython 中运行 Vuepy 应用。

- **类型**
  ```py
  %%vuepy_run
  sfc_content
  ```

- **示例 1**

  ```py
  %%vuepy_run
  <template>
    <Button description="add"
            button_style="info"
    ></Button>
  </template>
  ```
  
  如果需要访问当前jupyter笔记本中的变量可以通过以下方式

  ```python
  # --- cell 1 ---
  a = 1
  # --- cell 2 ---
  %%vuepy_run
  <template>
    <p>{{ a }}</p>
  </template>
  <script lang='py'>
  from IPython import get_ipython
  # 获取jupyter笔记本中的变量
  locals().update(get_ipython().user_ns)
  </script>
  ```

  -----

- **类型**
  ```py
  %%vuepy_run --plugins plugin1 plugin2 --app app1
  sfc_content
  ```

  * `--plugins`: 可选参数，指定 app 使用的插件
  * `--app`: 可选参数，将的 App 对象赋值给指定的变量

- **示例 2**

  ```py
  # --- cell 1 ---
  from ipywui import wui
  import foo_i18n  # for example
  # --- cell 2 ---
  %%vuepy_run --plugins wui i18n --app app1
  <template>
    <p>{{ _i18n_("hello") }}</p>
  </template>
  # --- cell 3 ---
  print(app1)  # App at 0x100000000
  ```
  
## %vuepy_log {#vuepy_log}

在 IPython 中打印 Vue.py 的内部日志。

- **类型**
  ```py
  %vuepy_log '' | clear
  ```

- **示例**

  打印所有日志。

  ```py
  from vuepy.utils import magic

  %vuepy_log
  ```

  打印日志，但会清除之前的日志。

  ```py
  from vuepy.utils import magic

  %vuepy_log clear
  ```
  
