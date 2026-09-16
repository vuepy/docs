<template>
  <VBox id="container">
    <Button id="btn-primary" label="主按钮" @click="on_click()" />
  </VBox>
</template>

<style lang="tcss">
#container {
    height: 1fr;
    align: center middle;
    background: #1a1d23;
}

#btn-primary {
    width: 20;
    background: $accent;
    color: $text;
}
</style>
