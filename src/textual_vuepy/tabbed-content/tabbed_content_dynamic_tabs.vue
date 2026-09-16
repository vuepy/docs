<template>
  <VBox>
  <TabbedContent initial="tab-users">
    <TabPane title="用户列表" id="tab-users">
      <DataTable :rows="users.value" :cols="['name', 'role']" />
    </TabPane>
    <TabPane title="统计" id="tab-stats">
      <Label>共 {{ len(users.value) }} 位用户</Label>
    </TabPane>
  </TabbedContent>
</VBox>
</template>

<script lang="py">
from vuepy import ref

users = ref([
    ("Alice", "admin"),
    ("Bob",   "user"),
])
</script>
