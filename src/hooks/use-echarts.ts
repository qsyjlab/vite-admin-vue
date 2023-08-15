import type { EChartsOption } from 'echarts'
import type { Ref } from 'vue'
import { tryOnUnmounted, useDebounceFn, useEventListener } from '@vueuse/core'
import { unref, nextTick, computed, ref, isRef } from 'vue'
import echarts from '@/plugins/echarts'

export function useECharts(
  elRef: Ref<HTMLDivElement | null> | HTMLDivElement,
  theme: 'light' | 'dark' | 'default' = 'default'
) {
  if (!isRef(elRef)) {
    elRef = ref(elRef)
  }

  let chartInstance: echarts.ECharts | null = null
  const resizeFn = useDebounceFn(resize, 200)
  const cacheOptions = ref({}) as Ref<EChartsOption>
  let removeResizeFn: Nullable<() => void> = null

  const getOptions = computed<EChartsOption>(() => {
    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value
    }
  })

  function initCharts(t = theme) {
    const el = unref(elRef)
    if (el) {
      chartInstance = echarts.init(el, t)
      removeResizeFn = useEventListener(window, 'resize', resizeFn)
    }
  }

  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options
    if (unref(elRef)?.offsetHeight === 0) {
      setTimeout(() => {
        setOptions(unref(getOptions))
      }, 30)
      return
    }
    nextTick(() => {
      setTimeout(() => {
        if (!chartInstance) {
          initCharts()

          if (!chartInstance) return
        }
        clear && chartInstance?.clear()

        chartInstance?.setOption(unref(getOptions))
      }, 30)
    })
  }

  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 50,
        easing: 'quadraticIn'
      }
    })
  }

  tryOnUnmounted(() => {
    if (!chartInstance) return
    removeResizeFn?.()
    chartInstance.dispose()
    chartInstance = null
  })

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      // initCharts(getDarkMode.value as 'default')
    }
    return chartInstance
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance
  }
}
