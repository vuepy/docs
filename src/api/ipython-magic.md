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
  
## %vuepy_log {#vuepy_log}

在 IPython 中打印 Vue.py 的内部日志。

- **类型**
  ```py
  %vuepy_log '' | clear
  ```

- **示例**

  打印所有日志。

  ```py
  from vuepy import create_app
  from vuepy.utils import magic

  %vuepy_log
  ```

  打印日志，但会清除之前的日志。

  ```py
  from vuepy import create_app
  from vuepy.utils import magic

  %vuepy_log clear
  ```
  
