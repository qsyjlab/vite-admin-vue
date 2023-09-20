import { ref } from 'vue'
import type { TableExpose } from './types'

/** 外部暴露 */
export function useProTable() {
  const tableRef = ref<TableExpose | null>(null)
  function register(instance: TableExpose | null) {
    tableRef.value = instance
  }

  function startEditable(rowKey: string) {
    tableRef.value?.startEditable(rowKey)
  }

  function cancelEditable(rowKey: string) {
    tableRef.value?.cancelEditable(rowKey)
  }

  function saveEditRow(rowKey: string) {
    tableRef.value?.saveEditRow(rowKey)
  }

  function deleteEditRow(rowKey: string) {
    tableRef.value?.deleteEditRow(rowKey)
  }

  return {
    register,
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow
  }
}
