import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import type { TableInstance } from 'element-plus'

interface UseProTableHeightOptions {
  enabled: () => boolean
  height: () => string | number | undefined
  tableRef: Ref<TableInstance | undefined>
  wrapperRef: Ref<HTMLDivElement | undefined>
  occupiedRefs: Array<Ref<HTMLDivElement | undefined>>
  dependencies: () => unknown[]
}

export function useProTableHeight(options: UseProTableHeightOptions) {
  const measuredHeight = ref<number>()
  let resizeObserver: ResizeObserver | undefined
  const tableHeight = computed(() => options.height() ?? measuredHeight.value)

  watch(options.dependencies, () => void nextTick(measureTableHeight), { deep: true })

  onMounted(() => {
    if (options.enabled() && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(measureTableHeight)
      ;[options.wrapperRef, ...options.occupiedRefs].forEach(element => {
        if (element.value) resizeObserver?.observe(element.value)
      })
    }
    void nextTick(measureTableHeight)
  })

  onBeforeUnmount(() => resizeObserver?.disconnect())

  function measureTableHeight() {
    if (!options.enabled() || !options.wrapperRef.value) return
    const occupiedHeight = options.occupiedRefs.reduce(
      (height, element) => height + (element.value?.offsetHeight ?? 0),
      0
    )
    measuredHeight.value = Math.max(0, options.wrapperRef.value.clientHeight - occupiedHeight)
    options.tableRef.value?.doLayout()
  }

  return { tableHeight, measureTableHeight }
}
