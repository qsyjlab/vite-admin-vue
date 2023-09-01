<template>
  <svg aria-hidden="true" class="svg-icon" :style="getStyle">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    prefix?: string
    name?: string
    color?: string
    size?: number | string
  }>(),
  {
    prefix: 'icon',
    size: 14
  }
)
const symbolId = computed(() => `#${props.prefix}-${props.name}`)

const getStyle = computed<CSSProperties>(() => {
  const { size } = props
  if (typeof size === 'string')
    return {
      width: size,
      height: size
    }

  return {
    width: `${size}px`,
    height: `${size}px`
  }
})
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  overflow: hidden;
  fill: currentcolor;
  vertical-align: -0.15em;
}
</style>
