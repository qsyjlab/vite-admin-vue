<template>
  <div class="layout-header" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LayoutHeaderProps } from '../interface'

type IProps = LayoutHeaderProps

const props = withDefaults(defineProps<IProps>(), {
  fixed: true,
  zIndex: 1001,
  minWidth: 1200,
  height: 56,
  paddingLeft: 200,
  transitionDuration: 200,
  transitionTimingFunction: 'ease-in-out'
})

const style = computed(() => {
  const {
    fixed,
    zIndex,
    // minWidth,
    height,
    paddingLeft,
    transitionDuration,
    transitionTimingFunction
  } = props
  const position = fixed ? 'fixed' : 'static'
  return `position: ${position};z-index: ${zIndex};height: ${height}px;padding-left: ${paddingLeft}px;transition-duration: ${transitionDuration}ms;transition-timing-function: ${transitionTimingFunction};box-sizing: border-box;`
})
</script>
