<template>
  <span>
    <code>{{ type }}</code><span>&nbsp;</span>
    <ClientOnly>
      <VPTooltip v-if='details' :text="details">
        <i class='fa fa-info-circle'></i>
      </VPTooltip>
    </ClientOnly>
  </span>
</template>

<script setup>
import VPTooltip from '@theme/components/VPTooltip.vue'

defineProps({
  type: String,
  details: String,
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

  width: 120px;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;

  opacity: 0;
  transition: opacity 1s;

  position: absolute;
  z-index: 1;

  background: #a782e8;
}

.text::after {
  content: " ";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #a782e8 transparent transparent transparent;
}
</style>
