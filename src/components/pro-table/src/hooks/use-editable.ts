import { Ref, computed, ref } from 'vue'
import { isDate, isEmpty } from 'lodash-es'
import type {
  ProTableColumns,
  ProTableEditable,
  EditableCellState,
  EditRowRule,
  RowKey,
  EditableTableRowKey
} from '../types'
import { getRowkey } from '../utils'

interface IProps {
  dataSource: Ref<any[]>
  rowKey: RowKey
  editableConfig: ProTableEditable
  columns: ProTableColumns
}

export function useEditable(props: IProps) {
  const { dataSource, editableConfig, columns } = props

  /** 可编辑表格状态
   *
   * isEdit: 是否处于编辑状态
   * data: 原数据 取消则回滚原数据
   */
  const editableCellMap = ref(new Map<EditableTableRowKey, EditableCellState>())

  function startEditable(rowKey: EditableTableRowKey) {
    if (editableConfig.mode === 'single') {
      clearEditRow()
    }

    // TODO: 考虑引用问题
    const data = findRow(rowKey)
    editableCellMap.value.set(rowKey, { isEdit: true, data: { ...data }, errors: {} })
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
    validateRowFields(
      rowKey,
      () => {
        if (editableConfig.onSave) {
          editableConfig.onSave(getEditData(rowKey), done)
        } else {
          done()
        }
      },
      () => {
        editableConfig.onError?.(editableCellMap.value.get(rowKey)?.errors)
      }
    )

    function done() {
      const row = findRow(rowKey)
      mergeEditData(row, cacheData)
      editableCellMap.value.delete(rowKey)
      editChange()
    }
  }

  function deleteEditable(rowKey: EditableTableRowKey) {
    if (editableConfig.onDelete) {
      editableConfig.onDelete(editableCellMap.value.get(rowKey)?.data || findRow(rowKey), done)
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

  // 验证当前未闭合的数据
  async function validateRowFields(
    rowKeys: EditableTableRowKey[] | EditableTableRowKey,
    callback?: () => void,
    errorCallback?: () => void
  ) {
    let needValidKeys = rowKeys as EditableTableRowKey[]

    if (!Array.isArray(rowKeys)) {
      needValidKeys = [rowKeys]
    }

    if (needValidKeys.length === 0) return

    const needValidRows = needValidKeys.map(needKey => getEditData(needKey))

    let hasError = false

    for (const row of needValidRows) {
      const realRowKey = getRowkey(row, props.rowKey)
      if (!realRowKey) continue

      for (const column of columns) {
        const value = row[column.key]

        const validResult = await validate(value, row, column.rowComponent?.rules || [])

        const cell = editableCellMap.value.get(realRowKey)
        if (validResult) {
          hasError = true

          cell && (cell.errors[column.key] = { message: validResult.message || '' })
        } else {
          cell && delete cell.errors[column.key]
        }
      }
    }

    if (!hasError) {
      callback?.()
    } else {
      errorCallback?.()
    }
  }

  // 验证器
  async function validate(
    value: any,
    row: any,
    rules: EditRowRule[]
  ): Promise<{ message: string } | null> {
    if (!rules) return null
    for (let i = 0; i < rules.length; i++) {
      const item = rules[i]

      if (isDate(value) && value) return null
      if (item.required && isEmpty(value)) {
        return {
          message: item.message || ''
        }
      }

      if (item.validator) {
        const { state, error } = await new Promise<{
          state: boolean
          error: null | string
        }>(resolve => {
          item.validator &&
            item?.validator(value, row, error => {
              if (!error)
                resolve({
                  state: true,
                  error: null
                })

              if (typeof error === 'string') {
                resolve({
                  state: false,
                  error
                })
              } else {
                resolve({
                  state: false,
                  error: error?.message || ''
                })
              }
            })
        })

        if (state) return null

        return {
          message: error || ''
        }
      }
    }

    return null
  }

  function clearValidateErrors(rowKey: EditableTableRowKey) {
    const cellState = editableCellMap.value.get(rowKey)

    if (cellState && cellState.errors) {
      cellState.errors = {}
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

  /**
   * 用来判定是否当前是否有编辑行开启
   */
  function hasEditingRow() {
    return editableCellMap.value.size > 0
  }

  return {
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

export type UseEditableReturn = ReturnType<typeof useEditable>
