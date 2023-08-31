<template>
  <div class="layout-sidebar" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

interface Props {
  /** fixed布局的层级 */
  zIndex?: number
  /** 宽度 */
  width?: number
  /** 顶部内边距 */
  paddingTop?: number
  /** 动画过渡时间 */
  transitionDuration?: number
  /** 动画过渡时间 */
  transitionTimingFunction?: string
}

const props = withDefaults(defineProps<Props>(), {
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
