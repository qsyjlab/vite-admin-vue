<template>
  <div class="layout-sidebar" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import type { LayoutSideBarProps } from '../interface'

type IProps = LayoutSideBarProps
const props = withDefaults(defineProps<IProps>(), {
  zIndex: 1002,
  width: 200,
  paddingTop: 0,
  transitionDuration: 200,
  transitionTimingFunction: 'ease-in-out'
})

const style = computed<CSSProperties>(() => {
  const { zIndex, width, paddingTop, transitionDuration, transitionTimingFunction } = props

  return {
    zIndex,
    transitionTimingFunction,
    transitionDuration: `${transitionDuration}ms`,
    width: `${width}px`,
    paddingTop: `${paddingTop}px`
  }
})
</script>
