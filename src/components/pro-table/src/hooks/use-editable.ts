import { Ref, computed, ref, watchEffect } from 'vue'
import { isEmpty } from 'lodash-es'
import type { ProTableColumns, ProTableEditable, ProTableEditRowComponent } from '../types'

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
  const editableCellMap = ref(
    new Map<
      string,
      {
        isEdit: boolean
        data: any
        errors: any
      }
    >()
  )

  watchEffect(() => {
    console.log('editableCellMap.value', editableCellMap.value)
  })

  function startEditable(rowKey: string) {
    if (editableConfig.mode === 'single') {
      clearEditRow()
    }
    const data = dataSource.value.find(i => i[props.rowKey] === rowKey)
    editableCellMap.value.set(rowKey, { isEdit: true, data: { ...data }, errors: {} })
  }

  function cancelEditable(rowKey: string) {
    const atIndex = dataSource.value.findIndex(i => i[props.rowKey] === rowKey)
    const data = editableCellMap.value.get(rowKey)?.data || {}

    if (editableConfig.onCancel) {
      editableConfig.onCancel(data, done)
    }

    function done() {
      Object.keys(data).forEach(key => {
        const row = dataSource.value[atIndex]
        row[key] = data[key]
      })
    }
  }

  function saveEditRow(rowKey: string) {
    validateRowFields(rowKey, () => {
      done()
    })

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

  // 验证当前未闭合的数据
  function validateRowFields(rowKeys: string[] | string, callback?: () => void) {
    let needValidKeys = rowKeys

    if (!Array.isArray(rowKeys)) {
      needValidKeys = [rowKeys]
    }

    if (needValidKeys.length === 0) return

    const needValidRows = dataSource.value.filter(row =>
      needValidKeys.includes(getRowKeyValue(row))
    )

    let hasError = false
    needValidRows.forEach(row => {
      columns.forEach(column => {
        const value = row[column.key]

        const error = validate(value, column.rowComponent?.rules || [])
        if (error) {
          hasError = true
          const cell = editableCellMap.value.get(getRowKeyValue(row))

          cell && (cell.errors[column.key] = error)
        }
      })
    })

    !hasError && callback?.()
  }

  // 验证器
  function validate(value: any, rules: ProTableEditRowComponent['rules']) {
    if (!rules) return null
    for (let i = 0; i < rules.length; i++) {
      const item = rules[i]
      if (item.required && isEmpty(value)) {
        return item
      }
    }

    return null
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

  return {
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow,
    clearEditRow,
    editableCellMap: computed(() => editableCellMap.value)
  }
}

export function isNull() {}

export type UseEditableReturn = ReturnType<typeof useEditable>
