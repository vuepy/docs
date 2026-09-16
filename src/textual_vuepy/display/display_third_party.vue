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
