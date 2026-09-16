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
