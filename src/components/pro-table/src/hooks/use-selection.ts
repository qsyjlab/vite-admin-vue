import type { TableInstance } from 'element-plus'
import { computed, type Ref, ref, type SetupContext, watch, nextTick } from 'vue'
import type { ProTableEmits } from '../props'
import type { ProTableProps, RowKey } from '../types'
import { getRowkey } from '../utils'

type IProps = {
  dataSource: Ref<ProTableProps['data']>
  selectedKeys: Ref<ProTableProps['selectedKeys']>
  rowKey: ProTableProps['rowKey']
  cacheSelectedData: Ref<ProTableProps['cacheSelectedData']>
}

export function useSelection(
  props: IProps,
  options: { tableInstance: Ref<TableInstance | null>; emits: SetupContext<ProTableEmits>['emit'] }
) {
  const selectedKeys = ref<any[]>([])
  const cacheSelectedData = new Map<unknown, any>()

  const { emits, tableInstance } = options || {}

  watch(
    [props.selectedKeys, props.dataSource, props.cacheSelectedData],
    () => {
      updateSelection()
    },
    { deep: true, immediate: true }
  )

  function updateSelection() {
    const dataSource = props.dataSource

    setSelectedKeys(props.selectedKeys.value)

    props.cacheSelectedData.value.forEach(item => {
      const realKey = getRowkey(item, props.rowKey)
      const row = dataSource.value.find(row => getRowkey(row, props.rowKey) === realKey)
      if (row) {
        cacheSelectedData.set(realKey, row)
      } else {
        cacheSelectedData.set(realKey, item)
      }
    })

    const rows = getRowsByRowKey(dataSource.value, props.rowKey, props.selectedKeys.value)

    rows.forEach(row => {
      const realKey = getRowkey(row, props.rowKey)
      cacheSelectedData.set(realKey, row)
    })
    nextTick(() => {
      rows.forEach(row => {
        tableInstance.value?.toggleRowSelection(row, true)
      })
    })
  }

  function setSelectedKeys(keys: any[]) {
    if (keys.toString() === selectedKeys.value.toString()) return
    selectedKeys.value = keys
    emits('update:selectedKeys', [...selectedKeys.value])
  }

  function clearSelectedKeys() {
    setSelectedKeys([])
    tableInstance.value?.clearSelection()
    cacheSelectedData.clear()
  }

  function getRowsByRowKey(data: any[], rowKey: RowKey, keys: any[]) {
    const rows: any[] = []

    data.forEach(row => {
      const realKey = getRowkey(row, rowKey)
      if (keys.includes(realKey)) {
        rows.push(row)
      }

      if (row.children && row.children.length) {
        rows.push(...getRowsByRowKey(row.children, rowKey, keys))
      }
    })

    return rows
  }

  return {
    cacheSelectedData,
    selectedKeys: computed(() => selectedKeys.value),
    setSelectedKeys,
    clearSelectedKeys
  }
}
