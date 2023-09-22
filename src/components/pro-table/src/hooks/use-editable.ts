import { Ref, computed, ref } from 'vue'
import { isEmpty } from 'lodash-es'
import type { ProTableColumns, ProTableEditable, EditableCellState, EditRowRule } from '../types'

interface IProps {
  dataSource: Ref<any[]>
  rowKey: string
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
  const editableCellMap = ref(new Map<string, EditableCellState>())

  function startEditable(rowKey: string) {
    if (editableConfig.mode === 'single') {
      clearEditRow()
    }
    const data = dataSource.value.find(i => getRowKeyValue(i) === rowKey)
    editableCellMap.value.set(rowKey, { isEdit: true, data: { ...data }, errors: {} })
  }

  function cancelEditable(rowKey: string) {
    const atIndex = dataSource.value.findIndex(i => i[props.rowKey] === rowKey)
    const data = editableCellMap.value.get(rowKey)?.data || {}

    if (editableConfig.onCancel) {
      editableConfig.onCancel(data, done)
    } else {
      done()
    }

    function done() {
      Object.keys(data).forEach(key => {
        const row = dataSource.value[atIndex]
        row[key] = data[key]
      })

      editableCellMap.value.delete(rowKey)
    }
  }

  function saveEditRow(rowKey: string) {
    validateRowFields(
      rowKey,
      () => {
        const row = dataSource.value.find(i => i[props.rowKey] === rowKey)
        if (editableConfig.onSave) {
          editableConfig.onSave(row, done)
        } else {
          done()
        }
      },
      () => {
        editableConfig.onError?.(editableCellMap.value.get(rowKey)?.errors)
      }
    )

    function done() {
      editableCellMap.value.delete(rowKey)
      editChange()
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
        editChange()
      }
    }
  }

  // 验证当前未闭合的数据
  async function validateRowFields(
    rowKeys: string[] | string,
    callback?: () => void,
    errorCallback?: () => void
  ) {
    let needValidKeys = rowKeys

    if (!Array.isArray(rowKeys)) {
      needValidKeys = [rowKeys]
    }

    if (needValidKeys.length === 0) return

    const needValidRows = dataSource.value.filter(row =>
      needValidKeys.includes(getRowKeyValue(row))
    )

    let hasError = false

    for (const row of needValidRows) {
      for (const column of columns) {
        const value = row[column.key]

        const validResult = await validate(value, row, column.rowComponent?.rules || [])
        const cell = editableCellMap.value.get(getRowKeyValue(row))
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

  function clearValidateErrors(rowKey: string) {
    const cellState = editableCellMap.value.get(rowKey)

    if (cellState && cellState.errors) {
      cellState.errors = {}
    }
  }

  function clearEditRow() {
    const rollbackKeys = Array.from(editableCellMap.value.keys())
    if (rollbackKeys.length === 0) return

    rollbackKeys.forEach(key => {
      rollbackRow(key)
    })

    editableCellMap.value.clear()
  }

  // 回滚某个行的数据
  function rollbackRow(rowKey: string) {
    const atIndex = dataSource.value.findIndex(i => getRowKeyValue(i) === rowKey)
    const data = editableCellMap.value.get(rowKey)?.data || {}

    Object.keys(data).forEach(key => {
      const row = dataSource.value[atIndex]
      row[key] = data[key]
    })

    /**
     * TODO: 不能直接赋值 会导致 table 中的 data 仍是编辑后的值，
     * 导致输入其他的格子会回滚旧值。
     * 暂时依次复制处理
     */
    // dataSource.value[atIndex] = { ...data }
  }

  function getRowKeyValue(row: any) {
    return row[props.rowKey]
  }

  function editChange() {
    /**
     * TODO:
     * 存在着非原值问题 (reactive value)
     * 非原值可能在 onChange 中意外修改，需要注意
     */
    editableConfig?.onChange?.(dataSource.value)
  }

  return {
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow,
    clearEditRow,
    clearValidateErrors,
    editableCellMap: computed(() => editableCellMap.value)
  }
}

export type UseEditableReturn = ReturnType<typeof useEditable>
