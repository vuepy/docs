<template>
  <VBox style="height: 1fr;">
    <DataTable ref="dt_ref" :cols="['商品', '价格']" :rows="items" style="height: 1fr;" />
    <Button label="追加行" @click="add_row()" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

dt_ref = ref(None)
items = [("苹果", "5.00"), ("香蕉", "3.00")]

def add_row():
    dt_ref.value.unwrap().add_row("橙子", "4.50")
</script>
