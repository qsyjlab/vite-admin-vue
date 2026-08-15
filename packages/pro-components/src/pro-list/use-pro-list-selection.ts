import { cloneDeep } from 'lodash-es'
import { ref, type Ref } from 'vue'
import { getProListRowKey } from './pro-list-utils'
import type { ProListRowKey } from './pro-list'

export interface UseProListSelectionOptions<TRecord extends object> {
  data: Ref<TRecord[]>
  rowKey: () => ProListRowKey<TRecord>
  reserveSelection: () => boolean
  selectedKeys: () => Array<string | number>
  onChange: (keys: Array<string | number>, records: TRecord[]) => void
}

export function useProListSelection<TRecord extends object>(
  options: UseProListSelectionOptions<TRecord>
) {
  const selectedKeyList = ref<Array<string | number>>([...options.selectedKeys()])
  const selectedRecordMap = new Map<string | number, TRecord>()

  function resolveRowKey(record: TRecord) {
    return getProListRowKey(record, options.rowKey()) ?? options.data.value.indexOf(record)
  }

  function isSelected(record: TRecord) {
    return selectedKeyList.value.includes(resolveRowKey(record))
  }

  function toggleSelection(record: TRecord, selected: boolean) {
    const key = resolveRowKey(record)
    const keys = new Set(selectedKeyList.value)
    if (selected) {
      keys.add(key)
      selectedRecordMap.set(key, record)
    } else {
      keys.delete(key)
      selectedRecordMap.delete(key)
    }
    selectedKeyList.value = [...keys]
    emitSelectionChange()
  }

  function clearSelection() {
    selectedKeyList.value = []
    selectedRecordMap.clear()
    emitSelectionChange()
  }

  function syncSelectedKeys(keys: Array<string | number>) {
    selectedKeyList.value = [...keys]
    pruneSelectedRecords()
  }

  function cacheVisibleRecords() {
    for (const record of options.data.value) {
      const key = resolveRowKey(record)
      if (selectedKeyList.value.includes(key)) selectedRecordMap.set(key, record)
    }
    pruneSelectedRecords()
  }

  function pruneSelectedRecords() {
    if (options.reserveSelection()) {
      for (const key of selectedRecordMap.keys()) {
        if (!selectedKeyList.value.includes(key)) selectedRecordMap.delete(key)
      }
      return
    }
    const visibleKeys = new Set(options.data.value.map(resolveRowKey))
    selectedKeyList.value = selectedKeyList.value.filter(key => visibleKeys.has(key))
    for (const key of selectedRecordMap.keys()) {
      if (!visibleKeys.has(key) || !selectedKeyList.value.includes(key)) {
        selectedRecordMap.delete(key)
      }
    }
  }

  function getSelectedRows() {
    return selectedKeyList.value
      .map(
        key =>
          selectedRecordMap.get(key) ??
          options.data.value.find(record => resolveRowKey(record) === key)
      )
      .filter((record): record is TRecord => Boolean(record))
      .map(record => cloneDeep(record))
  }

  function emitSelectionChange() {
    options.onChange([...selectedKeyList.value], getSelectedRows())
  }

  return {
    selectedKeyList,
    resolveRowKey,
    isSelected,
    toggleSelection,
    clearSelection,
    syncSelectedKeys,
    cacheVisibleRecords,
    getSelectedRows
  }
}
