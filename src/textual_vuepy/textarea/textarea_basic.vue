<template>
  <TextArea
    v-model="code.value"
    language="python"
    code_editor
    style="height: 1fr;"
  />
</template>

<script lang="py">
from vuepy import ref

code = ref("""def hello():
    print("Hello, World!")
""")
</script>
