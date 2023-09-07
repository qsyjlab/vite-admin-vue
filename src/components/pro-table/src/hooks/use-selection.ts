import { TableInstance } from 'element-plus'
import { computed, Ref, ref } from 'vue'

export function useSelection(options: { tableInstance: Ref<TableInstance | null> }) {
  const selectedKeys = ref<any[]>([])

  function setSelectedKeys(keys: any[]) {
    selectedKeys.value = keys
  }

  function clearSelectedKeys() {
    selectedKeys.value = []
    options.tableInstance.value?.clearSelection()
  }
  return {
    selectedKeys: computed(() => selectedKeys.value),
    setSelectedKeys,
    clearSelectedKeys
  }
}
