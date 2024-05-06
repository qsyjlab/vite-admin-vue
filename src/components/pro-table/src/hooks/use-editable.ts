import { Ref, computed, ref } from 'vue'
import type {
  ProTableColumns,
  ProTableEditable,
  EditableCellState,
  RowKey,
  EditableTableRowKey,
  EditableCellValidError
} from '../types'
import { getRowkey } from '../utils'
import { ElForm } from 'element-plus'

interface IProps {
  dataSource: Ref<any[]>
  rowKey: RowKey
  editableConfig: ProTableEditable
  columns: ProTableColumns
}

export function useEditable(props: IProps) {
  const { dataSource, editableConfig, columns } = props

  /**
   * 可编辑表格状态
   * isEdit: 是否处于编辑状态
   * data: 当前处于输入编辑的数据，保存则写入 dataSource,不直接修改表单项
   * erros: 暂时废弃 ，通过 onError 来获取并提示
   */
  const editableCellMap = ref(new Map<EditableTableRowKey, EditableCellState>())

  const formInstanceRef = ref<InstanceType<typeof ElForm> | null>(null)

  const editableRowsModel = computed(() => {
    const editModel: Record<string, any> = {}
    for (const [key, value] of editableCellMap.value.entries()) {
      if (value.isEdit) {
        editModel[key] = value.data
      }
    }

    return editModel
  })

  function setFormInstanceRef(ins: any) {
    formInstanceRef.value = ins
  }

  function startEditable(rowKey: EditableTableRowKey) {
    if (editableConfig.mode === 'single') {
      clearEditRow()
    }

    const data = findRow(rowKey)
    editableCellMap.value.set(rowKey, { isEdit: true, data: { ...data }, errors: undefined })
  }

  function cancelEditable(rowKey: EditableTableRowKey) {
    if (editableConfig.onCancel) {
      const data = editableCellMap.value.get(rowKey)?.data || {}
      editableConfig.onCancel(data, done)
    } else {
      done()
    }

    function done() {
      editableCellMap.value.delete(rowKey)
    }
  }

  function saveEditable(rowKey: EditableTableRowKey) {
    const cacheData = getEditData(rowKey)

    if (!formInstanceRef.value) {
      done()
      return
    }

    formInstanceRef.value?.validateField(getShouldValidKeys(rowKey), (invalid, errors) => {
      if (!invalid) {
        editableConfig.onError?.(getRealValidErrors(errors))
        return
      }

      if (editableConfig.onSave) {
        editableConfig.onSave(cacheData, done)
      } else {
        done()
      }
    })

    function done() {
      const row = findRow(rowKey)
      mergeEditData(row, cacheData)
      editableCellMap.value.delete(rowKey)
      editChange()
    }
  }

  function deleteEditable(rowKey: EditableTableRowKey) {
    if (editableConfig.onDelete) {
      editableConfig.onDelete(findRow(rowKey), done)
      return
    }

    done()

    function done() {
      const atIndex = findRowIndex(rowKey)

      if (atIndex !== -1) {
        dataSource.value.splice(atIndex, 1)
        editableCellMap.value.delete(rowKey)
        editChange()
      }
    }
  }

  function clearValidateErrors(rowKey: EditableTableRowKey) {
    const cellState = editableCellMap.value.get(rowKey)

    if (cellState && cellState.errors) {
      cellState.errors = undefined
    }
  }

  function clearEditRow() {
    editableCellMap.value.clear()
  }

  function mergeEditData(row: any, editRow: any) {
    Object.keys(editRow).forEach(key => {
      row[key] = editRow[key]
    })
  }

  function getEditData(rowKey: EditableTableRowKey) {
    return editableCellMap.value.get(rowKey)?.data || {}
  }
  function findRow(rowKey: EditableTableRowKey) {
    return dataSource.value.find(row => getRowkey(row, props.rowKey) === rowKey)
  }

  function findRowIndex(rowKey: EditableTableRowKey) {
    return dataSource.value.findIndex(row => getRowkey(row, props.rowKey) === rowKey)
  }

  function editChange() {
    /**
     * TODO:
     * 存在着非原值问题 (reactive value)
     * 非原值可能在 onChange 中意外修改，需要注意
     */
    editableConfig?.onChange?.(dataSource.value)
  }

  function getShouldValidKeys(rowKey: EditableTableRowKey) {
    return columns.map(col => `${rowKey}.${col.key}`)
  }

  /**
   * 用来判定是否当前是否有编辑行开启
   */
  function hasEditingRow() {
    return editableCellMap.value.size > 0
  }

  return {
    editableRowsModel,
    formInstanceRef,
    setFormInstanceRef,
    startEditable,
    cancelEditable,
    saveEditable,
    deleteEditable,
    clearEditRow,
    clearValidateErrors,
    hasEditingRow,
    editableCellMap: computed(() => editableCellMap.value)
  }
}

// 获取表单验证拼接后的 key
function getRealValidFieldKey(key: string) {
  const _key = key.split('.')
  return _key.length >= 2 ? _key[1] : key
}

function getRealValidErrors(errors: EditableCellValidError) {
  if (!errors) return {}
  const _errors: EditableCellValidError = {}

  Object.keys(errors).forEach(key => {
    const item = errors[key]
    const _rk = getRealValidFieldKey(key)

    _errors[_rk] = item
  })

  return _errors
}

export type UseEditableReturn = ReturnType<typeof useEditable>
