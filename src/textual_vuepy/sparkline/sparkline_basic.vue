<template>
  <VBox>
    <Label label="CPU 使用率趋势：" />
    <Sparkline :data="cpu_history.value" :summary_function="max" style="height: 3;" />
    <Button label="更新数据" @click="update()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import random

cpu_history = ref([random.uniform(0, 100) for _ in range(20)])

def update():
    new_data = cpu_history.value[1:] + [random.uniform(0, 100)]
    cpu_history.value = new_data
</script>
