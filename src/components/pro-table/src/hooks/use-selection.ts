import { TableInstance } from 'element-plus'
import { computed, Ref, ref, SetupContext, watch } from 'vue'
import { ProTableEmits, ProTableProps } from '../props'

type IProps = Pick<ProTableProps, 'selectedKeys' | 'rowKey'>

export function useSelection(
  props: IProps,
  options: { tableInstance: Ref<TableInstance | null>; emits: SetupContext<ProTableEmits>['emit'] }
) {
  const selectedKeys = ref<any[]>([])

  const { emits, tableInstance } = options || {}

  watch(
    () => props.selectedKeys,
    (newVal, oldVal) => {
      if (newVal.toString() === oldVal.toString()) return
      // 是否需要 diff
      setSelectedKeys(props.selectedKeys)

      getRowsByRowKey(tableInstance.value?.data || [], props.rowKey, props.selectedKeys).forEach(
        row => {
          tableInstance.value?.toggleRowSelection(row, true)
        }
      )
    },
    { deep: true }
  )

  function setSelectedKeys(keys: any[]) {
    if (keys.toString() === selectedKeys.value.toString()) return
    selectedKeys.value = keys

    emits('update:selectedKeys', selectedKeys.value)
  }

  function clearSelectedKeys() {
    setSelectedKeys([])
    tableInstance.value?.clearSelection()
  }

  function getRowsByRowKey(data: any[], rowKey: string, keys: any[]) {
    const rows: any[] = []
    data.forEach(item => {
      if (keys.includes(item[rowKey])) {
        rows.push(item)
      }

      if (item.children && item.children.length) {
        rows.push(...getRowsByRowKey(item.children, rowKey, keys))
      }
    })

    return rows
  }

  return {
    selectedKeys: computed(() => selectedKeys.value),
    setSelectedKeys,
    clearSelectedKeys
  }
}
