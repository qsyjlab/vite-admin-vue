import { describe, expect, it } from 'vitest'
import { getProPathValue } from '../../shared/pro-path'
import { getProTableColumnKey, getProTableColumnProp } from '../pro-table-utils'

interface Row {
  user: {
    name: string
  }
}

describe('ProTableColumn', () => {
  const column = {
    key: 'user-name',
    dataIndex: ['user', 'name'] as const,
    title: '姓名'
  }

  it('keeps the render key independent from the nested value path', () => {
    expect(getProTableColumnKey<Row>(column)).toBe('user-name')
    expect(getProTableColumnProp<Row>(column)).toBe('user.name')
    expect(getProPathValue({ user: { name: '活动' } }, column.dataIndex)).toBe('活动')
  })

  it('keeps nested columns available for recursive SFC rendering', () => {
    const parent = { key: 'user', children: [column] }
    expect(parent.children.map(getProTableColumnKey)).toEqual(['user-name'])
  })
})
