import { ref } from 'vue'

import type { InjectionKey } from 'vue'
import { createContext, useContext } from '@/hooks/core/use-context'

function useTableStore() {
  const sortColumnKeys: string[] = []

  const columnsMap = ref<Record<string, any>>({})

  const defaultColumnsMap = ref<Record<string, any> | null>(null)

  function setSortColumnKeys(keys: string[]) {
    return []
  }

  function setDefaultColumnsMap(map: Record<string, any>) {
    defaultColumnsMap.value = map
  }

  function mergeColumnsMap(map: Record<string, any>) {
    columnsMap.value = Object.assign({}, columnsMap.value, map)
  }

  function resetColumnsMap() {
    columnsMap.value = { ...defaultColumnsMap.value }
  }

  function getColumnMapConfig(key: string) {
    return columnsMap.value[key] || { show: true }
  }

  return {
    sortColumnKeys,
    defaultColumnsMap,
    setDefaultColumnsMap,
    columnsMap,
    mergeColumnsMap,
    resetColumnsMap,
    setSortColumnKeys,
    getColumnMapConfig
  }
}

export const store = useTableStore()

const contextKey: InjectionKey<ReturnType<typeof useTableStore>> = Symbol()

export function createTableStoreContext() {
  return createContext(store, contextKey, { readonly: false, native: true })
}

export function useTableStoreContext() {
  return useContext(contextKey)
}
