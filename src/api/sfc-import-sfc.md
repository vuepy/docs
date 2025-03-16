## import_sfc {#import_sfc}

将 SFC 组件像模块一样导入。

- **类型**

  ```py
  def import_sfc(sfc_file: str, raw_content=False) -> SFCType:
  ```

- **详细信息**

  Vue.py SFC 是框架指定的文件格式，因此必须交由编译器编译为标准的 Python 和 CSS，一个编译后的 SFC 是一个标准的 Python 类，这也意味着你通过 `import_sfc` 像导入模块一样导入 SFC。

  当 `raw_content` 为 `True` 时，sfc_file 可以传 sfc 的字符串内容。

- **示例**

  ```py
  from vuepy import import_sfc

  MyComponent = import_sfc('./MyComponent.vue')
  ```

  ```py
  from vuepy import import_sfc

  sfc_content = '''
    <template>
    <Button description="add"
            button_style="info"
    ></Button>
    </template>
  '''
  MyComponent = import_sfc(sfc_content, raw_content=True)
  ```
