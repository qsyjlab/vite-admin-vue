import { describe, expect, it } from 'vitest'
import {
  columnsToSearchFields,
  compactProTableSearchValues,
  splitProTableSearchColumns
} from '../pro-table-search-utils'
import type { ProTableSearchColumn } from '../pro-table-search'

interface RecordRow {
  id: number
  customer: {
    name: string
  }
  status: string
}

interface Query {
  keyword?: string
  customer?: {
    name?: string
  }
  status?: string
}

describe('pro-table search utils', () => {
  it('removes empty values while preserving zero and false', () => {
    expect(
      compactProTableSearchValues({
        keyword: '',
        status: undefined,
        nested: { empty: null, count: 0, enabled: false },
        tags: ['', 'active']
      })
    ).toEqual({ nested: { count: 0, enabled: false }, tags: ['active'] })
  })

  it('only adapts columns explicitly enabled for search', () => {
    const columns: ProTableSearchColumn<RecordRow, Query>[] = [
      { key: 'id', dataIndex: 'id', title: 'ID' },
      {
        key: 'customer-name',
        dataIndex: 'customer.name',
        title: '客户',
        search: true
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: '状态',
        valueType: 'status',
        search: { name: 'status', valueType: 'select', order: -1 }
      }
    ]

    expect(columnsToSearchFields(columns)).toEqual([
      expect.objectContaining({
        key: 'search-status',
        name: 'status',
        label: '状态',
        valueType: 'select'
      }),
      expect.objectContaining({
        key: 'search-customer-name',
        name: 'customer.name',
        label: '客户',
        valueType: 'text'
      })
    ])
  })

  it('returns independent field objects', () => {
    const search = { name: 'status' as const, fieldProps: { clearable: true } }
    const columns: ProTableSearchColumn<RecordRow, Query>[] = [
      { key: 'status', dataIndex: 'status', search }
    ]
    const fields = columnsToSearchFields(columns)
    ;(fields[0].fieldProps as Record<string, unknown>).clearable = false
    expect(search.fieldProps.clearable).toBe(true)
  })

  it('splits search metadata from runtime table columns', () => {
    const definitions: ProTableSearchColumn<RecordRow, Query>[] = [
      {
        key: 'status',
        dataIndex: 'status',
        search: { name: 'status' },
        children: [
          {
            key: 'customer',
            dataIndex: 'customer.name',
            searchName: 'customer.name'
          }
        ]
      }
    ]
    const result = splitProTableSearchColumns(definitions)

    expect(result.columns[0]).not.toHaveProperty('search')
    expect(result.columns[0].children?.[0]).not.toHaveProperty('searchName')
    expect(result.searchFields).toHaveLength(2)
  })
})
