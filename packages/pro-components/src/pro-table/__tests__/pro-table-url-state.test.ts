import { describe, expect, it } from 'vitest'
import {
  readProTableUrlState,
  resolveProTableUrlState,
  writeProTableUrlState
} from '../pro-table-url-state'

describe('pro-table-url-state', () => {
  it('reads pagination, sorter and filters from a namespaced query', () => {
    const config = resolveProTableUrlState({ key: 'orders' })!
    const search = new URLSearchParams({
      'orders.current': '3',
      'orders.pageSize': '20',
      'orders.sorter': JSON.stringify({ key: 'createdAt', order: 'descending' }),
      'orders.filters': JSON.stringify({ status: ['paid'] })
    })

    expect(readProTableUrlState(`?${search}`, config)).toEqual({
      current: 3,
      pageSize: 20,
      sorter: { key: 'createdAt', order: 'descending' },
      filters: { status: ['paid'] }
    })
  })

  it('ignores a query when all configured values are invalid', () => {
    const config = resolveProTableUrlState({ key: 'orders' })!
    const search = new URLSearchParams({
      'orders.current': '0',
      'orders.pageSize': 'invalid',
      'orders.sorter': '{broken',
      'orders.filters': '[]'
    })

    expect(readProTableUrlState(`?${search}`, config)).toBeUndefined()
  })

  it('writes table state without removing unrelated query values', () => {
    const config = resolveProTableUrlState({ key: 'orders' })!
    const result = writeProTableUrlState(
      '?tab=history&orders.current=1',
      {
        current: 4,
        pageSize: 50,
        sorter: { key: 'amount', field: 'total_amount', order: 'ascending' },
        filters: { status: ['paid', 'refunded'] }
      },
      config
    )
    const params = new URLSearchParams(result)

    expect(params.get('tab')).toBe('history')
    expect(params.get('orders.current')).toBe('4')
    expect(params.get('orders.pageSize')).toBe('50')
    expect(JSON.parse(params.get('orders.sorter')!)).toEqual({
      key: 'amount',
      field: 'total_amount',
      order: 'ascending'
    })
    expect(JSON.parse(params.get('orders.filters')!)).toEqual({
      status: ['paid', 'refunded']
    })
  })

  it('supports selectively disabling URL state fields', () => {
    const config = resolveProTableUrlState({
      key: 'orders',
      pagination: false,
      sorter: false
    })!
    const result = writeProTableUrlState(
      '?orders.current=2&orders.sorter=legacy',
      { current: 5, pageSize: 100, filters: { channel: ['web'] } },
      config
    )
    const params = new URLSearchParams(result)

    expect(params.get('orders.current')).toBe('2')
    expect(params.get('orders.sorter')).toBe('legacy')
    expect(JSON.parse(params.get('orders.filters')!)).toEqual({ channel: ['web'] })
  })
})
