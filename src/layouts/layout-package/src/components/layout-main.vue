<template>
  <div class="layout-main" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LayoutMainProps } from '../interface'

type IProps = LayoutMainProps

const props = withDefaults(defineProps<IProps>(), {
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 200,
  transitionDuration: 200,
  transitionTimingFunction: 'ease-in-out'
})

const style = computed(() => {
  const { paddingTop, paddingBottom, paddingLeft, transitionDuration, transitionTimingFunction } =
    props
  return `padding-top: ${paddingTop}px;padding-bottom: ${paddingBottom}px;padding-left: ${paddingLeft}px;transition-duration: ${transitionDuration}ms;transition-timing-function: ${transitionTimingFunction};`
})
</script>
