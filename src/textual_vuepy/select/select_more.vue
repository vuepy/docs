<template>
  <VBox>
    <!-- 动态选项列表 -->
    <Select
      v-model="selected_city.value"
      :options="city_options.value"
      prompt="选择城市"
      :allow_blank="False"
    />
    <Label :label="f'城市代码: {selected_city.value}'" />
  </VBox>
</template>

<script lang="py">
from vuepy import ref

city_options = ref([
    ("北京", "BJ"),
    ("上海", "SH"),
    ("广州", "GZ"),
    ("深圳", "SZ"),
])
selected_city = ref("BJ")
</script>
