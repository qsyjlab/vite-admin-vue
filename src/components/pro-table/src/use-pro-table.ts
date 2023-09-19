import { ref } from 'vue'
import type { TableExpose } from './types'

/** 外部暴露 */
export function useProTable() {
  const tableRef = ref<TableExpose | null>(null)
  function register(instance: TableExpose | null) {
    tableRef.value = instance

    console.log('tableRef.value', tableRef.value)
  }

  function startEditable() {}

  return {
    register
  }
}
