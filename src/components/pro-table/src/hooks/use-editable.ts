import { Ref, computed, ref } from 'vue'
import { ProTableEditable } from '../types'

interface IProps {
  dataSource: Ref<any[]>
  rowKey: string
  editableConfig: ProTableEditable
}

export function useEditable(props: IProps) {
  const { dataSource, editableConfig } = props
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
    if (editableConfig.mode === 'single') {
      clearEditRow()
    }
    const data = dataSource.value.find(i => i[props.rowKey] === rowKey)
    editableCellMap.value.set(rowKey, { isEdit: true, data: { ...data } })
  }

  function cancelEditable(rowKey: string) {
    const atIndex = dataSource.value.findIndex(i => i[props.rowKey] === rowKey)
    const data = editableCellMap.value.get(rowKey)?.data || {}

    if (editableConfig.onCancel) {
      editableConfig.onCancel(data, done)
    }

    function done() {
      dataSource.value[atIndex] = { ...data }
      editableCellMap.value.delete(rowKey)
    }
  }

  function saveEditRow(rowKey: string) {
    if (editableConfig.onSave) {
      editableConfig.onSave(editableCellMap.value.get(rowKey)?.data, done)

      return
    }
    done()

    function done() {
      editableCellMap.value.delete(rowKey)
    }
  }

  function deleteEditRow(rowKey: string) {
    if (editableConfig.onDelete) {
      editableConfig.onDelete(editableCellMap.value.get(rowKey)?.data, done)
      return
    }

    done()

    function done() {
      const atIndex = dataSource.value.findIndex(i => i[props.rowKey] === rowKey)

      if (atIndex !== -1) {
        dataSource.value.splice(atIndex, 1)
        editableCellMap.value.delete(rowKey)
      }
    }
  }

  function clearEditRow() {
    editableCellMap.value.clear()
  }

  return {
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow,
    editableCellMap: computed(() => editableCellMap.value)
  }
}

export type UseEditableReturn = ReturnType<typeof useEditable>
