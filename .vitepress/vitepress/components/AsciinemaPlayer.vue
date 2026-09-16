<template>
  <div ref="rootRef" class="asciinema-demo-player"></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // 相对站点根的 .cast 地址，如 /casts/overview_event_handling.cast
  src: {
    type: String,
    required: true,
  },
  cols: {
    type: [Number, String],
    default: undefined,
  },
  rows: {
    type: [Number, String],
    default: undefined,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  // [[秒, 标签], ...]，在进度条上标出各交互步骤
  markers: {
    type: Array,
    default: () => [],
  },
  // 压缩超过该秒数的空闲时间。播放器只对事件做时间压缩、不会同步调整
  // markers，两者同时使用会让标记错位，因此默认关闭。
  idleTimeLimit: {
    type: Number,
    default: undefined,
  },
})

const rootRef = ref(null)
let player = null

function dispose() {
  if (player) {
    player.dispose()
    player = null
  }
}

async function mountPlayer() {
  dispose()
  if (!rootRef.value) return

  const AsciinemaPlayer = await import('asciinema-player')
  await import('asciinema-player/dist/bundle/asciinema-player.css')

  player = AsciinemaPlayer.create(props.src, rootRef.value, {
    cols: props.cols ? Number(props.cols) : undefined,
    rows: props.rows ? Number(props.rows) : undefined,
    autoPlay: props.autoplay,
    loop: props.loop,
    idleTimeLimit: props.idleTimeLimit,
    fit: 'width',
    controls: true,
    markers: props.markers.length ? props.markers : undefined,
  })
}

onMounted(mountPlayer)
onBeforeUnmount(dispose)
watch([() => props.src, () => props.markers], mountPlayer)
</script>

<style>
.asciinema-demo-player .ap-player {
  /* 跟随 VitePress 主题背景，避免亮色模式下播放器边缘突兀 */
  border-radius: 4px;
  overflow: hidden;
}
</style>
