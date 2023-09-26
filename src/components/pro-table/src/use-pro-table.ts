import { ref, isRef } from 'vue'
import type { TableActionRef, RowKey } from './types'
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
  /** editable end */

  return {
    register,
    getTableRef,
    /** editable start */
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow,
    hasEditingRow
    /** editable end */
  }
}
