---
outline: deep
titleTemplate: :title | Textual-vuepy
---

# Display 原生 Widget 嵌入

Display 是桥接组件，用于将 Python 代码中创建的原生 Textual Widget 实例（或 Widget 类）直接嵌入到 Vue 模板布局中，实现 Vue 声明式布局与 Textual 原生组件的混用。

> 底层：原生 Textual Widget 或 Widget 类

## 基本用法

:::textual-vuepy-demo display_basic
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
from textual.widgets import Button, Welcome as WelcomeWidget

# 创建普通 Textual Widget 实例后直接嵌入
my_widget = Button(label="from instance")

# 或者传入类（Display 会自动实例化）
MyWidget = WelcomeWidget
</script>
```
:::

::: tip
部分 Widget（如 `DataTable.add_columns`）在构造后立刻调用方法会依赖已激活的 App。
这类初始化请放到 `@onMounted` 中（见下方 DataTable 示例）。
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `obj` | Widget \| type[Widget] | — | **必填**。传入 Textual Widget **实例**时直接显示；传入 Widget **类**时自动实例化后显示，不支持动态切换 |

## v-model

Display 无 `v-model`，内容完全由 `obj` 控制。

## 事件

| 事件 | 说明 |
|------|------|
| — | Display 本身无特殊事件；Widget 实例的事件通过 Textual 原生机制处理 |

## 使用场景

### 场景一：预配置的 DataTable

:::textual-vuepy-demo display_datatable
```vue
<template>
  <VBox style="height: 1fr;">
    <Display :obj="table_widget" style="height: 1fr;" />
    <Button label="追加行" @click="add_row()" />
  </VBox>
</template>

<script lang="py">
from vuepy import onMounted
from textual.widgets import DataTable

table_widget = DataTable(zebra_stripes=True, show_cursor=True)

# DataTable.add_columns 需要 active app，放到 onMounted
@onMounted
def init_table():
    if table_widget.columns:
        return
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
:::

### 场景二：第三方 Textual 组件

:::textual-vuepy-demo display_third_party
```vue
<template>
  <VBox style="height: 1fr;">
    <Label label="以下为自定义 Textual Widget：" />
    <Display :obj="ThirdPartyWidget" style="height: 1fr;" />
  </VBox>
</template>

<script lang="py">
from textual.widgets import Static

# 任意 Textual Widget 类均可传给 Display（自动实例化）
class ThirdPartyWidget(Static):
    DEFAULT_CSS = """
    ThirdPartyWidget {
        content-align: center middle;
        height: 1fr;
        border: solid green;
    }
    """

    def __init__(self, **kwargs):
        super().__init__("Hello from custom Widget", **kwargs)
</script>
```
:::

## 通用属性

所有 Textual-vuepy 组件均支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | str | 组件 CSS ID |
| `style` | str | TCSS 内联样式 |
| `class` | str | TCSS 类名（空格分隔）|
| `border_title` | str | 边框标题 |
| `border_subtitle` | str | 边框副标题 |
