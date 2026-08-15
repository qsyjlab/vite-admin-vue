import { describe, expect, it } from 'vitest'
import type { ProTableColumns } from '../../pro-table'
import {
  applyProEditableTableColumnDefaults,
  createProEditableTableNewRowTracker,
  hasProEditableTableColumn
} from '../pro-editable-table-utils'

interface Row {
  id: number
  name: string
  profile: {
    owner: string
  }
}

describe('pro-editable-table utils', () => {
  it('applies editable defaults recursively without overriding explicit column settings', () => {
    const columns: ProTableColumns<Row> = [
      {
        key: 'base',
        title: '基础信息',
        children: [
          { key: 'name', dataIndex: 'name' },
          { key: 'owner', dataIndex: 'profile.owner', editable: false }
        ]
      },
      { key: 'operation', title: '操作' }
    ]

    const result = applyProEditableTableColumnDefaults(columns, 'operation')

    expect(result[0].editable).toBe(true)
    expect(result[0].children?.[0].editable).toBe(true)
    expect(result[0].children?.[1].editable).toBe(false)
    expect(result[1].editable).toBe(false)
    expect(columns[0].children?.[0].editable).toBeUndefined()
    expect(hasProEditableTableColumn(result, 'owner')).toBe(true)
  })

  it('removes cancelled new rows but keeps existing rows unchanged', () => {
    const tracker = createProEditableTableNewRowTracker<Row>(() => 'id')
    const existing = { id: 1, name: '现有行', profile: { owner: 'A' } }
    const appended = { id: 2, name: '新增行', profile: { owner: 'B' } }
    const data = [existing, appended]

    tracker.add(appended)
    expect(tracker.remove(data, 1)).toEqual({ data, removed: false })
    expect(tracker.remove(data, 2)).toEqual({ data: [existing], removed: true })
    expect(tracker.has(2)).toBe(false)
  })

  it('drops tracked keys after controlled data removes the row', () => {
    const tracker = createProEditableTableNewRowTracker<Row>(() => 'id')
    const appended = { id: 2, name: '新增行', profile: { owner: 'B' } }

    tracker.add(appended)
    tracker.sync([])

    expect(tracker.has(2)).toBe(false)
  })
})
