<template>
  <VBox style="height: 1fr;">
    <Label label="网络流量（最近 30 秒）" />
    <Sparkline
      :data="net_in.value"
      :summary_function="max"
      style="height: 3;"
      border_title="入站 KB/s"
    />
    <Sparkline
      :data="net_out.value"
      :summary_function="max"
      style="height: 3;"
      border_title="出站 KB/s"
    />
    <Button label="模拟刷新" @click="tick()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref
import random

net_in  = ref([random.uniform(0, 500) for _ in range(30)])
net_out = ref([random.uniform(0, 200) for _ in range(30)])

def tick():
    net_in.value  = list(net_in.value[1:])  + [random.uniform(0, 500)]
    net_out.value = list(net_out.value[1:]) + [random.uniform(0, 200)]
</script>
