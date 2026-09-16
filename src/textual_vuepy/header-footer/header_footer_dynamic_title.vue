<template>
  <VBox style="height: 1fr;">
    <Header :title="app_title.value" :subtitle="app_subtitle.value" />
    <VBox style="height: 1fr; align: center middle;">
      <Label label="点击按钮切换标题" />
      <Button label="切换标题" @click="toggle_title()" />
    </VBox>
    <Footer />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

app_title    = ref("My App")
app_subtitle = ref("就绪")

pages = [
    ("主页", "欢迎"),
    ("设置", "配置中"),
    ("关于", "v1.0.0"),
]
page_idx = ref(0)

def toggle_title():
    page_idx.value = (page_idx.value + 1) % len(pages)
    t, s = pages[page_idx.value]
    app_title.value    = t
    app_subtitle.value = s
</script>
