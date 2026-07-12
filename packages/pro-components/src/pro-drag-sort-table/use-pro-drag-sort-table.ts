import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProDragSortTableInstance } from './pro-drag-sort-table'

export function useProDragSortTable<TRecord extends object>(
  templateRef?: Readonly<ShallowRef<ProDragSortTableInstance<TRecord> | null>>
) {
  const dragSortTableRef = templateRef ?? shallowRef<ProDragSortTableInstance<TRecord> | null>(null)

  async function getDragSortTable() {
    await nextTick()
    const instance = dragSortTableRef.value
    if (!instance) throw new Error('ProDragSortTable instance is not available')
    return instance
  }

  return { dragSortTableRef, getDragSortTable }
}
