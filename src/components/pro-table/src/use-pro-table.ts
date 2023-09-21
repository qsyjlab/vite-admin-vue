import { ref } from 'vue'
import type { TableActionRef } from './types'

/** 外部暴露 */
export function useProTable() {
  const tableRef = ref<TableActionRef | null>(null)
  function register(instance: TableActionRef | null) {
    tableRef.value = instance
  }

  function getEditableCellUtils() {
    return tableRef.value?.editableCellUtils
  }

  function startEditable(rowKey: string) {
    getEditableCellUtils()?.startEditable(rowKey)
  }

  function cancelEditable(rowKey: string) {
    getEditableCellUtils()?.cancelEditable(rowKey)
  }

  function saveEditRow(rowKey: string) {
    getEditableCellUtils()?.saveEditRow(rowKey)
  }

  function deleteEditRow(rowKey: string) {
    getEditableCellUtils()?.deleteEditRow(rowKey)
  }

  return {
    register,
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow
  }
}
