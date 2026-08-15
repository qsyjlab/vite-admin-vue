import { effect, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { ProTableColumn, ProTableColumns, ProTableEditable } from '../pro-table'
import { useProTableEditable } from '../hooks/use-pro-table-editable'

interface Row {
  id: number
  name: string
}

const nameColumn: ProTableColumn<Row> = {
  key: 'name',
  dataIndex: 'name',
  editable: true,
  rowComponent: {
    el: 'el-input',
    rules: [{ required: true, message: '请输入名称' }]
  }
}

function setup(editable: ProTableEditable<Row> = {}) {
  const data = ref<Row[]>([
    { id: 1, name: 'A' },
    { id: 2, name: 'B' }
  ])
  const columns: ProTableColumns<Row> = [nameColumn]
  const changed = vi.fn()
  const state = useProTableEditable({
    data,
    columns: () => columns,
    rowKey: () => 'id',
    editable: () => editable,
    onChange: changed
  })
  return { data, changed, state }
}

describe('use-pro-table-editable', () => {
  it('edits a cloned row and only writes it back after a valid save', async () => {
    const onSave = vi.fn(() => true)
    const { data, changed, state } = setup({ enableValidate: true, onSave })

    expect(state.startEditable(1)).toBe(true)
    expect(state.getRowState(data.value[0])?.isEdit).toBe(true)
    state.updateEditableValue(data.value[0], nameColumn, '')
    expect(data.value[0].name).toBe('A')
    await expect(state.saveEditable(1)).resolves.toBe(false)
    expect(state.getRowEditableState(1)?.errors.name?.[0].message).toBe('请输入名称')

    state.updateEditableValue(data.value[0], nameColumn, '更新后')
    await expect(state.saveEditable(1)).resolves.toBe(true)
    expect(data.value[0].name).toBe('更新后')
    expect(onSave).toHaveBeenCalledOnce()
    expect(changed).toHaveBeenCalledWith(data.value)
  })

  it('keeps only one editing row in single mode', () => {
    const { state } = setup({ mode: 'single' })
    state.startEditable(1)
    state.startEditable(2)
    expect(state.getRowEditableState(1)).toBeUndefined()
    expect(state.getRowEditableState(2)?.isEdit).toBe(true)
  })

  it('exposes row editing state reactively to cell renderers', () => {
    const { data, state } = setup()
    let editing = false
    effect(() => {
      editing = Boolean(state.getRowState(data.value[0]))
    })

    expect(editing).toBe(false)
    state.startEditable(1)
    expect(editing).toBe(true)
    state.clearEditRows()
    expect(editing).toBe(false)
  })

  it('supports promise actions and blocks deletion when they return false', async () => {
    const { data, state } = setup({ onDelete: async () => false })
    await expect(state.deleteEditable(1)).resolves.toBe(false)
    expect(data.value).toHaveLength(2)
  })

  it('replaces the saved row when onSave returns a normalized record', async () => {
    const { data, state } = setup({
      onSave: async row => ({ ...row, id: 101, name: row.name.trim().toUpperCase() })
    })

    state.startEditable(1)
    state.updateEditableValue(data.value[0], nameColumn, ' updated ')

    await expect(state.saveEditable(1)).resolves.toBe(true)
    expect(data.value[0]).toEqual({ id: 101, name: 'UPDATED' })
  })

  it('gets, validates and saves all editable rows', async () => {
    const onSave = vi.fn(async (row: Row) => ({ ...row, name: `${row.name}-saved` }))
    const { data, state } = setup({ enableValidate: true, onSave })
    state.startEditable(1)
    state.startEditable(2)

    expect(state.getEditableKeys()).toEqual([1, 2])
    await expect(state.validateEditable()).resolves.toBe(true)
    await expect(state.saveAllEditable()).resolves.toBe(true)
    expect(data.value.map(row => row.name)).toEqual(['A-saved', 'B-saved'])
    expect(state.getEditableKeys()).toEqual([])
    expect(onSave).toHaveBeenCalledTimes(2)
  })

  it('keeps invalid rows editing and reports validation errors in bulk', async () => {
    const onSave = vi.fn()
    const { data, state } = setup({ enableValidate: true, onSave })
    state.startEditable(1)
    state.startEditable(2)
    state.updateEditableValue(data.value[1], nameColumn, '')

    await expect(state.saveAllEditable()).resolves.toBe(false)
    expect(state.getEditableKeys()).toEqual([1, 2])
    expect(state.getRowEditableState(2)?.errors.name?.[0].message).toBe('请输入名称')
    expect(onSave).not.toHaveBeenCalled()
  })

  it('cancels every approved row and leaves rejected rows editing', async () => {
    const { state } = setup({ onCancel: async row => row.id !== 2 })
    state.startEditable(1)
    state.startEditable(2)

    await expect(state.cancelAllEditable()).resolves.toBe(false)
    expect(state.getEditableKeys()).toEqual([2])
  })
})
