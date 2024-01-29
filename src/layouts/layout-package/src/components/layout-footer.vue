<template>
  <div class="layout-footer" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LayoutFooterProps } from '../interface'

type IProps = LayoutFooterProps

const props = withDefaults(defineProps<IProps>(), {
  fixed: true,
  zIndex: 999,
  minWidth: 1200,
  height: 56,
  paddingLeft: 0,
  transitionDuration: 200,
  transitionTimingFunction: 'ease-in-out'
})

const style = computed(() => {
  const { zIndex, height, paddingLeft, transitionDuration, transitionTimingFunction } = props
  return ` z-index: ${zIndex};;height: ${height}px;padding-left: ${paddingLeft}px;transition-duration: ${transitionDuration}ms;transition-timing-function: ${transitionTimingFunction};box-sizing: border-box;`
})
</script>
