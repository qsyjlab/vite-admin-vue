<template>
  <div ref="watermarkContainerRef" :style="styles">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, CSSProperties, onBeforeUnmount } from 'vue'
import { useWaterMark } from './use-watermark'
import type { WatermarkProps } from './use-watermark'
const watermarkContainerRef = ref<HTMLElement | null>(null)

const props = defineProps<WatermarkProps>()

const { render, destroy } = useWaterMark(watermarkContainerRef, { ...props })

onMounted(() => {
  if (watermarkContainerRef.value) {
    render()
  }
})

onBeforeUnmount(() => {
  destroy()
})

const styles = computed<CSSProperties>(() => {
  return {
    position: 'relative'
  }
})
</script>
<style scoped></style>
