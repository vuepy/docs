# IPython Magic

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

- **示例**

  ```py
  %vuepy_run app.vue
  ```

也可以运行已导入的组件。

- **类型**
  ```py
  %vuepy_run $$Component
  ```

- **示例**

  ```py
  from vuepy import import_sfc
  Component = import_sfc("component.vue")

  # ----------------------
  %vuepy_run $$Component
  ```

## %%vuepy_run {#vuepy_run_cell}

在 IPython 中运行 Vuepy 应用。

- **类型**
  ```py
  %%vuepy_run
  sfc_content
  ```

- **示例**

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
  
