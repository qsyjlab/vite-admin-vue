<template>
  <div ref="watermarkContainerRef" class="watermark" :style="styles">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, type CSSProperties, onBeforeUnmount, watch } from 'vue'
import { useWaterMark } from './use-watermark'
import type { WatermarkProps } from './use-watermark'
const watermarkContainerRef = ref<HTMLElement | null>(null)

const props = defineProps<WatermarkProps>()

const { render, destroy } = useWaterMark(watermarkContainerRef, ref(props))

onMounted(() => {
  if (watermarkContainerRef.value) {
    render()
  }
})

watch(
  () => props,
  () => {
    destroy()

    render()
  },
  {
    deep: true
  }
)

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
