<template>
  <VBox style="height: 1fr; align: center middle;">
    <Label :label="f'Count: {count.value}'" />
    <HBox>
      <Button label="+" @click="increment()" />
      <Button label="-" @click="decrement()" />
    </HBox>
  </VBox>
</template>

<script lang="py">
from vuepy import ref

count = ref(0)

def increment():
    count.value += 1

def decrement():
    count.value -= 1
</script>

<style lang="tcss">
VBox {
    height: 1fr;
    align: center middle;
}

Button {
    width: 6;
    margin: 0 1;
}
</style>
