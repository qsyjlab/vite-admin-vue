import { ref } from 'vue'

export function useSettingStore() {
  const sortColumnKeys: string[] = []

  const columnsMap = ref<Record<string, any>>()

  function setSortColumnKeys(keys: string[]) {
    return []
  }

  function mergeColumnsMap(map: Record<string, any>) {
    columnsMap.value = Object.assign({}, columnsMap.value, map)
    console.log('columnsMap', columnsMap.value)
  }

  return {
    sortColumnKeys,
    columnsMap,
    mergeColumnsMap,
    setSortColumnKeys
  }
}
