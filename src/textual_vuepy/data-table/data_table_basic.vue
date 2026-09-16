<template>
  <DataTable
    :cols="['姓名', '年龄', '城市']"
    :rows="users"
    zebra_stripes
    style="height: 1fr;"
  />
</template>

<script lang="py">
users = [
    ("张三", "28", "北京"),
    ("李四", "35", "上海"),
    ("王五", "22", "广州"),
]
</script>
