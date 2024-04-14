<template>
  <div class="tooltip-box">
    <slot />
    <div class='tooltip'>
      <code class='text'>{{ text }}</code>
    </div>
  </div>
</template>

<script setup>

defineProps({
  text: String,
})
</script>

<style scoped>
.tooltip-box {
  position: relative;
  display: inline-block;
}

.tooltip-box:hover .tooltip{
  opacity: 1;
}

.tooltip {
  color: #ffffff;
  text-align: center;
  padding: 5px 0;
  border-radius: 2px;

  width: 200px;
  bottom: 120%;
  left: 100%;
  margin-left: -200px;

  opacity: 0;
  transition: opacity 1s;

  position: absolute;
  z-index: 1;
}

.text {
  padding: 5px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  width: auto;
}

.text::after {
  content: " ";
  position: absolute;
  top: 80%;
  left: 100%;
  width: 10px;
  height: 10px;
  margin-left: -12px;

  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-bottom-color: transparent !important;
  border-right-color: transparent !important;
  transform: rotate(225deg);
}
</style>
