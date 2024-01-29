<template>
  <div class="layout-tab" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LayoutTabsProps } from '../interface'

type IProps = LayoutTabsProps

const props = withDefaults(defineProps<IProps>(), {
  fixed: true,
  top: 56,
  zIndex: 999,
  minWidth: 0,
  height: 56,
  paddingLeft: 0,
  transitionDuration: 200,
  transitionTimingFunction: 'ease-in-out'
})

const style = computed(() => {
  const {
    fixed,
    top,
    zIndex,
    minWidth,
    height,
    paddingLeft,
    transitionDuration,
    transitionTimingFunction
  } = props
  const position = fixed ? 'fixed' : 'static'
  return `position: ${position};top: ${top}px;z-index: ${zIndex};min-width: ${minWidth}px;height: ${height}px;padding-left: ${paddingLeft}px;transition-duration: ${transitionDuration}ms;transition-timing-function: ${transitionTimingFunction};box-sizing: border-box;`
})
</script>
