<template>
  <el-icon v-if="icon && epIconMap[icon]" v-bind="getAttrs">
    <component :is="epIconMap[icon]" />
  </el-icon>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import {
  HomeFilled,
  Stopwatch,
  Document,
  Timer,
  Link,
  ArrowDown,
  WarningFilled,
  Refresh,
  Close,
  Upload,
  CircleClose,
  Grid
} from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    icon?: string
    size?: number
    color?: string
  }>(),
  {
    size: 24
  }
)

const epIconMap: Record<string, any> = {
  'home-filled': HomeFilled,
  stopwatch: Stopwatch,
  document: Document,
  timer: Timer,
  link: Link,
  'arrow-down': ArrowDown,
  'warning-filled': WarningFilled,
  refresh: Refresh,
  close: Close,
  upload: Upload,
  'circle-close': CircleClose,
  grid: Grid
}

const getAttrs = computed(() => {
  const { size } = props
  if (typeof size === 'string')
    return {
      size
    }

  return {
    size: `${size}px`
  }
})
</script>
