<template>
  <VBox style="height: 1fr;">
    <Label label="请求详情：" />
    <Pretty :object="request_info" style="height: 1fr;" border_title="Request" />
  </VBox>
</template>

<script lang="py">
from dataclasses import dataclass

@dataclass
class RequestInfo:
    method: str
    url: str
    status: int
    headers: dict

request_info = RequestInfo(
    method="GET",
    url="https://api.example.com/data",
    status=200,
    headers={"Content-Type": "application/json", "X-Token": "abc123"},
)
</script>
