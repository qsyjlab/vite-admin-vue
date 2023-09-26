import { ref } from 'vue'
import type { TableActionRef, RowKey } from './types'

/** 外部暴露 */
export function useProTable() {
  const tableRef = ref<TableActionRef | null>(null)
  function register(instance: TableActionRef | null) {
    tableRef.value = instance
  }

  function getEditableCellUtils() {
    return tableRef.value?.editableCellUtils
  }

  function startEditable(rowKey: RowKey) {
    getEditableCellUtils()?.startEditable(rowKey)
  }

  function cancelEditable(rowKey: RowKey) {
    getEditableCellUtils()?.cancelEditable(rowKey)
  }

  function saveEditRow(rowKey: RowKey) {
    getEditableCellUtils()?.saveEditRow(rowKey)
  }

  function deleteEditRow(rowKey: RowKey) {
    getEditableCellUtils()?.deleteEditRow(rowKey)
  }

  function hasEditingRow() {
    return getEditableCellUtils()?.hasEditingRow()
  }

  return {
    register,
    /** editable start */
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow,
    hasEditingRow
    /** editable end */
  }
}
