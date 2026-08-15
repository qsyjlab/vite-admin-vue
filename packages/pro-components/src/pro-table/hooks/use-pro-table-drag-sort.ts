import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import type { TableInstance } from 'element-plus'
import Sortable from 'sortablejs'
import type { ProTableColumn, ProTableDragSort, ProTableDragSortEnd } from '../pro-table'
import { getProTableColumnKey, moveProTableRow } from '../pro-table-utils'

interface UseProTableDragSortOptions<TRecord extends object> {
  dragSort: () => boolean | ProTableDragSort<TRecord> | undefined
  data: Ref<TRecord[]>
  columns: Ref<ProTableColumn<TRecord>[]>
  tableRef: Ref<TableInstance | undefined>
  onChange: (event: ProTableDragSortEnd<TRecord>) => void
}

export function useProTableDragSort<TRecord extends object>(
  options: UseProTableDragSortOptions<TRecord>
) {
  const ready = ref(false)
  const config = computed(() => {
    const value = options.dragSort()
    if (!value) return undefined
    return value === true ? {} : value
  })
  let sortableInstance: Sortable | undefined

  watch(
    [config, () => options.data.value.length, options.columns],
    () => void nextTick(initDragSort),
    { deep: true }
  )
  onMounted(() => void nextTick(initDragSort))
  onBeforeUnmount(destroy)

  function isDragHandleColumn(column: ProTableColumn<TRecord>) {
    return Boolean(
      config.value?.handleColumnKey && getProTableColumnKey(column) === config.value.handleColumnKey
    )
  }

  function initDragSort() {
    destroy()
    if (!config.value || config.value.disabled || !options.tableRef.value) return
    const tableElement = (options.tableRef.value as TableInstance & { $el?: HTMLElement }).$el
    const tbody = tableElement?.querySelector('.el-table__body-wrapper tbody') as
      | HTMLElement
      | undefined
    if (!tbody) return
    sortableInstance = Sortable.create(tbody, {
      animation: config.value.animation ?? 180,
      handle: config.value.handleColumnKey ? '.pro-table-drag-handle__icon' : undefined,
      onEnd: event => {
        const { oldIndex, newIndex } = event
        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return
        const row = options.data.value[oldIndex]
        if (!row) return
        const data = moveProTableRow(options.data.value, oldIndex, newIndex)
        options.data.value = data
        const payload = { oldIndex, newIndex, row, data }
        options.onChange(payload)
        config.value?.onEnd?.(payload)
      }
    })
    ready.value = true
  }

  function destroy() {
    sortableInstance?.destroy()
    sortableInstance = undefined
    ready.value = false
  }

  return { config, ready, isDragHandleColumn }
}
