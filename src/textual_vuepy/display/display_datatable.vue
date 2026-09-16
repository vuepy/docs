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
