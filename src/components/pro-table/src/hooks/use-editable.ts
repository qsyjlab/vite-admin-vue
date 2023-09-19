import { Ref, computed, ref } from 'vue'

interface IProps {
  dataSource: Ref<any[]>
  rowKey: string
}

export function useEditable(props: IProps) {
  const { dataSource } = props
  /** 可编辑表格状态
   *
   * isEdit: 是否处于编辑状态
   * data: 原数据 取消则回滚原数据
   */
  const editableCellMap = ref(
    new Map<
      string,
      {
        isEdit: boolean
        data: any
      }
    >()
  )

  function startEditable(rowKey: string) {
    const data = dataSource.value.find(i => i[props.rowKey] === rowKey)
    editableCellMap.value.set(rowKey, { isEdit: true, data: { ...data } })
  }

  function cancelEditable(rowKey: string | string[]) {
    let rowKeys: string[] = []

    if (!Array.isArray(rowKey)) {
      rowKeys = [rowKey]
    } else {
      rowKeys = rowKey
    }
    rowKeys.forEach(key => {
      const atIndex = dataSource.value.findIndex(i => i[props.rowKey] === key)
      const data = editableCellMap.value.get(key)?.data || {}
      dataSource.value[atIndex] = { ...data }
      editableCellMap.value.delete(key)
    })
  }

  function saveEditRow(rowKey: string) {
    editableCellMap.value.delete(rowKey)
  }

  return {
    startEditable,
    cancelEditable,
    saveEditRow,
    editableCellMap: computed(() => editableCellMap.value)
  }
}
