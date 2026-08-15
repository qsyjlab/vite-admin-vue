import { cloneDeep } from 'lodash-es'
import { ref, type Ref } from 'vue'
import { setProPathValue } from '../../shared/pro-path'
import type {
  ProTableColumn,
  ProTableEditable,
  ProTableEditableAction,
  ProTableEditableRowKey,
  ProTableEditableRowState,
  ProTableEditableSaveAction,
  ProTableRowKey
} from '../pro-table'
import { getProTableEditablePath, validateProTableEditableRow } from '../pro-table-editable-utils'
import { getProTableRowKey } from '../pro-table-utils'

interface UseProTableEditableOptions<TRecord extends object> {
  data: Ref<TRecord[]>
  columns: () => ProTableColumn<TRecord>[]
  rowKey: () => ProTableRowKey<TRecord>
  editable: () => ProTableEditable<TRecord> | undefined
  onChange: (data: TRecord[]) => void
}

export function useProTableEditable<TRecord extends object>(
  options: UseProTableEditableOptions<TRecord>
) {
  const editableRowMap = ref(
    new Map<ProTableEditableRowKey, ProTableEditableRowState<TRecord>>()
  ) as Ref<Map<ProTableEditableRowKey, ProTableEditableRowState<TRecord>>>

  function findRow(rowKey: ProTableEditableRowKey) {
    return options.data.value.find(row => getProTableRowKey(row, options.rowKey()) === rowKey)
  }

  function startEditable(rowKey: ProTableEditableRowKey) {
    const row = findRow(rowKey)
    if (!row) return false
    if (options.editable()?.mode === 'single') clearEditRows()
    const state: ProTableEditableRowState<TRecord> = {
      isEdit: true,
      data: cloneDeep(row),
      errors: {}
    }
    editableRowMap.value.set(rowKey, state)
    return true
  }

  async function cancelEditable(rowKey: ProTableEditableRowKey) {
    const state = editableRowMap.value.get(rowKey)
    if (!state) return false
    const approved = await invokeEditableAction(options.editable()?.onCancel, state.data)
    if (!approved) return false
    editableRowMap.value.delete(rowKey)
    return true
  }

  async function saveEditable(rowKey: ProTableEditableRowKey) {
    return saveEditableRow(rowKey, true)
  }

  async function saveEditableRow(rowKey: ProTableEditableRowKey, shouldValidate: boolean) {
    const state = editableRowMap.value.get(rowKey)
    if (!state) return false
    const editable = options.editable()

    if (shouldValidate && editable?.enableValidate && !(await validateEditable(rowKey))) {
      return false
    }

    const result = await invokeEditableSaveAction(editable?.onSave, state.data)
    if (!result.approved) return false
    const savedRow = result.row ?? state.data
    const nextData = options.data.value.map(row =>
      getProTableRowKey(row, options.rowKey()) === rowKey ? cloneDeep(savedRow) : row
    )
    options.data.value = nextData
    editableRowMap.value.delete(rowKey)
    emitChange(nextData)
    return true
  }

  async function deleteEditable(rowKey: ProTableEditableRowKey) {
    const row = findRow(rowKey)
    if (!row) return false
    const approved = await invokeEditableAction(options.editable()?.onDelete, row)
    if (!approved) return false
    const nextData = options.data.value.filter(
      item => getProTableRowKey(item, options.rowKey()) !== rowKey
    )
    options.data.value = nextData
    editableRowMap.value.delete(rowKey)
    emitChange(nextData)
    return true
  }

  function updateEditableValue(row: TRecord, column: ProTableColumn<TRecord>, value: unknown) {
    const rowKey = getProTableRowKey(row, options.rowKey())
    if (rowKey === undefined) return
    const state = editableRowMap.value.get(rowKey)
    if (!state) return
    setProPathValue(state.data, getProTableEditablePath(column), value)
    delete state.errors[String(column.key)]
  }

  function getRowEditableState(rowKey: ProTableEditableRowKey) {
    return editableRowMap.value.get(rowKey)
  }

  function getRowState(row: TRecord) {
    const rowKey = getProTableRowKey(row, options.rowKey())
    return rowKey === undefined ? undefined : editableRowMap.value.get(rowKey)
  }

  function clearEditRows() {
    editableRowMap.value.clear()
  }

  function hasEditingRow() {
    return editableRowMap.value.size > 0
  }

  function getEditableKeys() {
    return Array.from(editableRowMap.value.keys())
  }

  async function validateEditable(rowKey?: ProTableEditableRowKey) {
    const keys = rowKey === undefined ? getEditableKeys() : [rowKey]
    if (rowKey !== undefined && !editableRowMap.value.has(rowKey)) return false

    let valid = true
    for (const key of keys) {
      const state = editableRowMap.value.get(key)
      if (!state) continue
      const errors = await validateProTableEditableRow(state.data, options.columns())
      state.errors = errors ?? {}
      options.editable()?.onError?.(errors)
      if (errors) valid = false
    }
    return valid
  }

  async function saveAllEditable() {
    const keys = getEditableKeys()
    if (options.editable()?.enableValidate && !(await validateEditable())) return false
    for (const key of keys) {
      if (!(await saveEditableRow(key, false))) return false
    }
    return true
  }

  async function cancelAllEditable() {
    const keys = getEditableKeys()
    let cancelled = true
    for (const key of keys) {
      if (!(await cancelEditable(key))) cancelled = false
    }
    return cancelled
  }

  function emitChange(data: TRecord[]) {
    const clonedData = cloneDeep(data)
    options.editable()?.onChange?.(clonedData)
    options.onChange(clonedData)
  }

  return {
    editableRowMap,
    startEditable,
    cancelEditable,
    saveEditable,
    deleteEditable,
    updateEditableValue,
    getRowEditableState,
    getRowState,
    clearEditRows,
    hasEditingRow,
    getEditableKeys,
    validateEditable,
    saveAllEditable,
    cancelAllEditable
  }
}

async function invokeEditableSaveAction<TRecord extends object>(
  action: ProTableEditableSaveAction<TRecord> | undefined,
  row: TRecord
): Promise<{ approved: boolean; row?: TRecord }> {
  if (!action) return { approved: true }
  const result = await action(cloneDeep(row))
  if (result === false) return { approved: false }
  if (result && typeof result === 'object') return { approved: true, row: cloneDeep(result) }
  return { approved: true }
}

async function invokeEditableAction<TRecord extends object>(
  action: ProTableEditableAction<TRecord> | undefined,
  row: TRecord
) {
  if (!action) return true
  return (await action(cloneDeep(row))) !== false
}
