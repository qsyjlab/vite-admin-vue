import { describe, expect, it } from 'vitest'
import {
  getCollapsedProDescriptionsColumns,
  getProDescriptionsErrorText,
  getProDescriptionsValue,
  getVisibleProDescriptionsColumns,
  groupProDescriptionsColumns,
  resolveProDescriptionsColumnSpan,
  resolveProDescriptionsResponsiveNumber
} from '../pro-descriptions-utils'
import type { ProDescriptionsColumn } from '../pro-descriptions'

interface Profile {
  id: number
  user: {
    name: string
    contacts: Array<{ type: string; value: string }>
  }
  status: 'active' | 'disabled'
}

describe('pro descriptions utils', () => {
  const data: Profile = {
    id: 1,
    user: {
      name: '张伟',
      contacts: [{ type: 'mobile', value: '13800000000' }]
    },
    status: 'active'
  }

  it('uses dataIndex for value lookup and never falls back to key', () => {
    expect(
      getProDescriptionsValue(data, {
        key: 'customer-name',
        dataIndex: 'user.name'
      })
    ).toBe('张伟')

    expect(
      getProDescriptionsValue(data, {
        key: 'user.name'
      })
    ).toBeUndefined()
  })

  it('supports dot notation and array dataIndex paths', () => {
    expect(
      getProDescriptionsValue(data, {
        key: 'customer-name',
        dataIndex: 'user.name'
      })
    ).toBe('张伟')

    expect(
      getProDescriptionsValue(data, {
        key: 'mobile',
        dataIndex: ['user', 'contacts', 0, 'value']
      })
    ).toBe('13800000000')
  })

  it('evaluates dynamic hide against current data without mutating columns', () => {
    const columns: ProDescriptionsColumn<Profile>[] = [
      { key: 'id', dataIndex: 'id' },
      { key: 'name', dataIndex: 'user.name', hide: true },
      {
        key: 'status',
        dataIndex: 'status',
        hide: current => current.status === 'disabled'
      }
    ]

    expect(getVisibleProDescriptionsColumns(columns, data)).toEqual([columns[0], columns[2]])
    expect(
      getVisibleProDescriptionsColumns(columns, {
        ...data,
        status: 'disabled'
      })
    ).toEqual([columns[0]])
    expect(getVisibleProDescriptionsColumns(columns)).toEqual([columns[0], columns[2]])
    expect(columns).toHaveLength(3)
  })

  it('resolves xs, sm, md and lg responsive numbers', () => {
    const responsive = { xs: 1, sm: 2, md: 3, lg: 4 }

    expect(resolveProDescriptionsResponsiveNumber(responsive, 375, 6)).toBe(1)
    expect(resolveProDescriptionsResponsiveNumber(responsive, 768, 6)).toBe(2)
    expect(resolveProDescriptionsResponsiveNumber(responsive, 992, 6)).toBe(3)
    expect(resolveProDescriptionsResponsiveNumber(responsive, 1200, 6)).toBe(4)
    expect(resolveProDescriptionsResponsiveNumber(responsive, 1920, 6)).toBe(4)
    expect(resolveProDescriptionsResponsiveNumber(2.9, 375, 6)).toBe(2)
  })

  it('resolves responsive spans and clamps them to the column count', () => {
    const column: ProDescriptionsColumn<Profile> = {
      key: 'name',
      dataIndex: 'user.name',
      span: { xs: 1, md: 4 }
    }

    expect(resolveProDescriptionsColumnSpan(column, 375, 3).span).toBe(1)
    expect(resolveProDescriptionsColumnSpan(column, 992, 3).span).toBe(3)
    expect(column.span).toEqual({ xs: 1, md: 4 })
  })

  it('calculates collapsed columns from resolved row spans', () => {
    const columns: ProDescriptionsColumn<Profile>[] = [
      { key: 'id', dataIndex: 'id', span: 2 },
      { key: 'name', dataIndex: 'user.name', span: 1 },
      { key: 'status', dataIndex: 'status', span: 2 },
      { key: 'mobile', dataIndex: ['user', 'contacts', 0, 'value'], span: 1 }
    ]

    expect(getCollapsedProDescriptionsColumns(columns, 3, 1)).toEqual(columns.slice(0, 2))
    expect(getCollapsedProDescriptionsColumns(columns, 3, 2)).toEqual(columns)
    expect(getCollapsedProDescriptionsColumns([], 3, 1)).toEqual([])
  })

  it('keeps group insertion order and resolves group titles', () => {
    const columns: ProDescriptionsColumn<Profile>[] = [
      { key: 'name', dataIndex: 'user.name', group: 'base' },
      { key: 'id', dataIndex: 'id' },
      { key: 'status', dataIndex: 'status', group: 'audit' },
      { key: 'mobile', dataIndex: ['user', 'contacts', 0, 'value'], group: 'base' }
    ]

    const groups = groupProDescriptionsColumns(columns, {
      base: '基础信息',
      audit: '审核信息'
    })

    expect(groups.map(group => ({ key: group.key, title: group.title }))).toEqual([
      { key: 'base', title: '基础信息' },
      { key: '__default__', title: undefined },
      { key: 'audit', title: '审核信息' }
    ])
    expect(groups[0]?.columns).toEqual([columns[0], columns[3]])
  })

  it('resolves custom, error and fallback error text', () => {
    const error = new Error('请求失败')

    expect(getProDescriptionsErrorText(error, '自定义错误')).toBe('自定义错误')
    expect(getProDescriptionsErrorText(error, current => `加载失败：${String(current)}`)).toBe(
      '加载失败：Error: 请求失败'
    )
    expect(getProDescriptionsErrorText(error)).toBe('请求失败')
    expect(getProDescriptionsErrorText({ code: 500 })).toBe('详情加载失败，请稍后重试')
  })
})
