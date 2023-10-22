import { ref, isRef } from 'vue'
import type { TableActionRef, EditableTableRowKey } from './types'
import { nextTick } from 'vue'

/** 外部暴露 */
export function useProTable() {
  const tableActionRef = ref<TableActionRef>()
  function register(instance: TableActionRef | null) {
    if (!instance) return
    tableActionRef.value = instance
  }

  async function getTableRef() {
    await nextTick()

    const tableRef = tableActionRef.value?.tableRef

    if (isRef(tableRef)) return tableRef.value

    return tableRef
    // return tableActionRef.value?.tableRef.
  }

  /** editable */
  function getEditableCellUtils() {
    return tableActionRef.value?.editableCellUtils
  }

  function startEditable(rowKey: EditableTableRowKey) {
    getEditableCellUtils()?.startEditable(rowKey)
  }

  function cancelEditable(rowKey: EditableTableRowKey) {
    getEditableCellUtils()?.cancelEditable(rowKey)
  }

  function saveEditable(rowKey: EditableTableRowKey) {
    getEditableCellUtils()?.saveEditable(rowKey)
  }

  function deleteEditable(rowKey: EditableTableRowKey) {
    getEditableCellUtils()?.deleteEditable(rowKey)
  }

  function hasEditingRow() {
    return getEditableCellUtils()?.hasEditingRow()
  }
  /** editable end */

  return {
    register,
    getTableRef,
    reload: () => {
      tableActionRef.value?.reload()
    },
    refresh: () => {
      tableActionRef.value?.refresh()
    },

    /** editable start */
    startEditable,
    cancelEditable,
    saveEditable,
    deleteEditable,
    hasEditingRow
    /** editable end */
  }
}
