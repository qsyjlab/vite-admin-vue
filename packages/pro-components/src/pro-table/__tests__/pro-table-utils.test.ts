import { describe, expect, it } from 'vitest'
import {
  getProTableColumnKey,
  getProTableColumnProp,
  getProTableRowKey,
  applyProTableColumnState,
  createProTableColumnState,
  normalizeProTableResponse,
  moveProTableRow,
  paginateProTableData
} from '../pro-table-utils'
import {
  createProTableColumnSettingTree,
  reorderProTableColumnState
} from '../hooks/use-pro-table-columns'

interface Row {
  id: number
  user: {
    name: string
  }
}

describe('pro-table utils', () => {
  const rows: Row[] = [
    { id: 1, user: { name: 'A' } },
    { id: 2, user: { name: 'B' } },
    { id: 3, user: { name: 'C' } }
  ]

  it('keeps render keys independent from data paths', () => {
    const column = { key: 'customer-name', dataIndex: ['user', 'name'] as const }
    expect(getProTableColumnKey(column)).toBe('customer-name')
    expect(getProTableColumnProp(column)).toBe('user.name')
  })

  it('reads nested row keys and supports key functions', () => {
    expect(getProTableRowKey(rows[0], 'id')).toBe(1)
    expect(getProTableRowKey(rows[0], row => row.user.name)).toBe('A')
  })

  it('paginates local data without mutating it', () => {
    expect(paginateProTableData(rows, { current: 2, pageSize: 2 })).toEqual([rows[2]])
    expect(rows).toHaveLength(3)
  })

  it('moves a row without mutating source data', () => {
    expect(moveProTableRow(rows, 0, 2)).toEqual([rows[1], rows[2], rows[0]])
    expect(rows.map(row => row.id)).toEqual([1, 2, 3])
    expect(moveProTableRow(rows, -1, 2)).toEqual(rows)
  })

  it('normalizes invalid response collections and totals', () => {
    expect(
      normalizeProTableResponse({ data: undefined as unknown as Row[], total: Number.NaN })
    ).toEqual({ data: [], total: 0, success: undefined })
  })

  it('applies persisted visibility, order and fixed state without mutating columns', () => {
    const columns = [
      { key: 'id', dataIndex: 'id' as const },
      { key: 'name', dataIndex: 'user.name' as const }
    ]
    const defaults = createProTableColumnState<Row>(columns)
    const result = applyProTableColumnState<Row>(columns, {
      ...defaults,
      id: { ...defaults.id, order: 1, fixed: 'left' },
      name: { ...defaults.name, order: 0, show: false }
    })

    expect(result).toEqual([{ ...columns[0], fixed: 'left', children: undefined }])
    expect(columns[0]).not.toHaveProperty('fixed')
  })

  it('keeps multi-level column groups and reorders every sibling level independently', () => {
    const columns = [
      {
        key: 'user',
        title: '用户',
        children: [
          { key: 'name', title: '姓名' },
          { key: 'age', title: '年龄' }
        ]
      },
      { key: 'status', title: '状态' }
    ]
    const defaults = createProTableColumnState<Row>(columns)
    const childReordered = reorderProTableColumnState(defaults, ['age', 'name'])
    const tree = createProTableColumnSettingTree(columns, childReordered)

    expect(tree.map(column => column.key)).toEqual(['user', 'status'])
    expect(tree[0].children?.map(column => column.key)).toEqual(['age', 'name'])
  })
})
