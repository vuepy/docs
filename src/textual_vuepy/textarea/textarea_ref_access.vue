<template>
  <VBox>
    <TextArea ref="editor_ref" v-model="code.value" language="python" code_editor />
    <Button label="获取选中文字" @click="get_selected()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

editor_ref = ref(None)
code = ref("# 在此输入代码\n")

def get_selected():
    if editor_ref.value:
        widget = editor_ref.value.unwrap()
        print(f"选中内容: {widget.selected_text}")
</script>
