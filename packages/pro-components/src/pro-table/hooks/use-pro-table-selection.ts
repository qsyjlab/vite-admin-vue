import { nextTick, ref, watch, type Ref } from 'vue'
import type { TableInstance } from 'element-plus'
import type { ProTableRowKey } from '../pro-table'
import { getProTableRowKey } from '../pro-table-utils'

interface UseProTableSelectionOptions<TRecord extends object> {
  data: Ref<TRecord[]>
  tableRef: Ref<TableInstance | undefined>
  rowKey: () => ProTableRowKey<TRecord>
  checkable: () => boolean
  reserveSelection: () => boolean
  selectedKeys: () => Array<string | number>
  cacheSelectedData: () => TRecord[]
  onChange: (keys: Array<string | number>, rows: TRecord[]) => void
}

export function useProTableSelection<TRecord extends object>(
  options: UseProTableSelectionOptions<TRecord>
) {
  const selectedRows = new Map<string | number, TRecord>()
  const selectedKeyList = ref<Array<string | number>>([...options.selectedKeys()])
  let syncing = false

  options.cacheSelectedData().forEach(row => {
    const key = getProTableRowKey(row, options.rowKey())
    if (key !== undefined) selectedRows.set(key, row)
  })

  watch(
    options.selectedKeys,
    keys => {
      selectedKeyList.value = [...keys]
      void syncVisibleSelection()
    },
    { deep: true }
  )

  function handleSelectionChange(rows: TRecord[]) {
    if (syncing) return
    if (!options.reserveSelection()) selectedRows.clear()
    options.data.value
      .map(row => getProTableRowKey(row, options.rowKey()))
      .filter((key): key is string | number => key !== undefined)
      .forEach(key => selectedRows.delete(key))
    rows.forEach(row => {
      const key = getProTableRowKey(row, options.rowKey())
      if (key !== undefined) selectedRows.set(key, row)
    })
    commitSelection()
  }

  async function syncVisibleSelection() {
    if (!options.checkable() || !options.tableRef.value) return
    await nextTick()
    syncing = true
    options.tableRef.value.clearSelection()
    const keySet = new Set(selectedKeyList.value)
    options.data.value.forEach(row => {
      const key = getProTableRowKey(row, options.rowKey())
      if (key !== undefined && keySet.has(key)) {
        selectedRows.set(key, row)
        options.tableRef.value?.toggleRowSelection(row, true)
      }
    })
    syncing = false
  }

  function clearSelection() {
    selectedRows.clear()
    selectedKeyList.value = []
    options.tableRef.value?.clearSelection()
    options.onChange([], [])
  }

  function getSelectedRows() {
    return Array.from(selectedRows.values())
  }

  function commitSelection() {
    selectedKeyList.value = Array.from(selectedRows.keys())
    options.onChange([...selectedKeyList.value], getSelectedRows())
  }

  return {
    selectedKeyList,
    handleSelectionChange,
    syncVisibleSelection,
    clearSelection,
    getSelectedRows
  }
}
