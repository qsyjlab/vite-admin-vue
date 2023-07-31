import { ref } from 'vue'

export function useSettingStore() {
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
