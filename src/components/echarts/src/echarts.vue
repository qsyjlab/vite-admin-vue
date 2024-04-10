<template>
  <div ref="chartRef" :style="style"></div>
</template>
<script setup lang="ts">
import { useEcharts } from '@/hooks'
import { onMounted } from 'vue'
import { ref, watch } from 'vue'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ProEcharts'
})

type DEvent = (...args: any[]) => any

interface IProps {
  style?: CSSProperties
  options?: any
  events?: Record<string, DEvent>
}

const props = withDefaults(defineProps<IProps>(), {
  style: () => ({ height: '400px' }),
  options: () => ({}),
  events: () => ({})
})

const chartRef = ref<Nullable<HTMLDivElement>>(null)

const { setOptions } = useEcharts(chartRef, instance => {
  Object.keys(props.events).forEach(eventName => {
    instance?.on(eventName, props.events[eventName])
  })
})

onMounted(() => {
  setOptions(props.options)
})

watch(
  () => props.options,
  () => {
    setOptions(props.options)
  },
  {
    deep: true,
    // dom 更新后执行
    flush: 'post'
  }
)
</script>
