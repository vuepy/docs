# 日志系统 {#log}


## getLogger {#getlogger}

获取 Vue.py 内部使用的 logger，可用于设置日志的级别、handler 等。

- **类型** 
  ```py
  from vuepy.log import getLogger
  def getLogger(name: str = 'vuepy') -> logging.Logger:
  ```

- **示例**

  ```py
  import logging
  from vuepy.log import getLogger
  
  logger = getLogger()
  
  # 设置日志级别为 info 
  logger.setLevel(logging.INFO)
  ```
  

## logout

Vue.py 内部 logger 的输出，可将日志打印到 Notebook 中。

- **类型**: `ipywidgets.Output`

- **示例**

  ```py
  from vuepy.log import logout
  
  # 记录日志
  logout
  ```
