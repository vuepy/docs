---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Display 原生 Widget 嵌入

Display 是桥接组件，用于将 Python 代码中创建的原生 Textual Widget 实例（或 Widget 类）直接嵌入到 Vue 模板布局中，实现 Vue 声明式布局与 Textual 原生组件的混用。

> 底层：原生 Textual Widget 或 Widget 类

## 基本用法

```vue
<template>
  <VBox style="height: 1fr;">
    <!-- 显示 Widget 实例 -->
    <Display :obj="my_widget" />
    <!-- 显示 Widget 类（自动实例化）-->
    <Display :obj="MyWidget" />
  </VBox>
</template>

<script lang="py">
from textual.widgets import DataTable

# 创建一个普通 Textual Widget 实例
my_widget = DataTable()
my_widget.add_columns("A", "B")
my_widget.add_row("1", "2")

# 或者传入类
from textual.widgets import Welcome as WelcomeWidget
MyWidget = WelcomeWidget
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `obj` | Widget \| type[Widget] | — | **必填**。传入 Textual Widget **实例**时直接显示；传入 Widget **类**时自动实例化后显示 |

## v-model

Display 无 `v-model`，内容完全由 `obj` 控制。

## 事件

| 事件 | 说明 |
|------|------|
| — | Display 本身无特殊事件；Widget 实例的事件通过 Textual 原生机制处理 |

## 使用场景

### 场景一：预配置的 DataTable

```vue
<template>
  <VBox style="height: 1fr;">
    <Display :obj="table_widget" style="height: 1fr;" />
    <Button label="追加行" @click="add_row()" />
  </VBox>
</template>

<script lang="py">
from textual.widgets import DataTable

table_widget = DataTable(zebra_stripes=True, show_cursor=True)
table_widget.add_columns("序号", "名称", "状态", "时间")
table_widget.add_row("001", "任务 A", "完成", "09:00")
table_widget.add_row("002", "任务 B", "进行中", "10:30")

def add_row():
    import datetime
    now = datetime.datetime.now().strftime("%H:%M")
    table_widget.add_row(
        f"{table_widget.row_count + 1:03d}",
        f"任务 {chr(67 + table_widget.row_count - 2)}",
        "待开始",
        now,
    )
</script>
```

### 场景二：第三方 Textual 组件

```vue
<template>
  <VBox style="height: 1fr;">
    <Label label="以下为第三方 Textual 组件：" />
    <Display :obj="ThirdPartyWidget" style="height: 1fr;" />
  </VBox>
</template>

<script lang="py">
# 假设存在一个第三方 Textual 组件
from some_textual_library import AdvancedChart

ThirdPartyWidget = AdvancedChart
</script>
```

### 场景三：动态切换 Widget

```vue
<template>
  <VBox style="height: 1fr;">
    <Display :obj="current_widget.value" style="height: 1fr;" />
    <HBox style="height: 3;">
      <Button label="显示表格" @click="show_table()" />
      <Button label="显示日志" @click="show_log()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref
from textual.widgets import DataTable, RichLog

_table = DataTable()
_table.add_columns("名称", "值")
_table.add_row("示例", "数据")

_log = RichLog(markup=True)
_log.write("[green]系统启动[/green]")

current_widget = ref(_table)

def show_table():
    current_widget.value = _table

def show_log():
    current_widget.value = _log
</script>
```

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
