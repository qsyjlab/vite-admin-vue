import { computed, nextTick, reactive, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ProConfigProviderContext } from '../../pro-config-provider'
import { useProTableData } from '../hooks/use-pro-table-data'
import type { ProTableProps } from '../pro-table'
import { resolveProTableServerFilters } from '../store/use-pro-table-store'

interface Row {
  id: number
  name: string
}

function setup(props: ProTableProps<Row, Record<string, never>>) {
  const beforePageChange = vi.fn()
  const afterLoad = vi.fn()
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  const state = useProTableData({
    props,
    proConfig: computed(() => ({})) as ProConfigProviderContext,
    currentSize: ref(),
    beforePageChange,
    afterLoad,
    onLoadingChange: vi.fn(),
    onPageChange: vi.fn(),
    onSorterChange: vi.fn(),
    onFiltersChange: vi.fn(),
    onRequestStateChange: vi.fn(),
    onRequestError: vi.fn()
  })
  warn.mockRestore()
  return { state, beforePageChange, afterLoad }
}

describe('use-pro-table-data', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('syncs controlled local data without treating it as a page change', async () => {
    const props = reactive<ProTableProps<Row, Record<string, never>>>({
      columns: [],
      data: [{ id: 1, name: 'A' }],
      pagination: false,
      autoRequest: true
    } as ProTableProps<Row, Record<string, never>>)
    const { state, beforePageChange } = setup(props)
    await nextTick()

    expect(state.tableData.value).toEqual([{ id: 1, name: 'A' }])
    expect(beforePageChange).not.toHaveBeenCalled()

    props.data = [
      { id: 1, name: 'A-saved' },
      { id: 2, name: 'B' }
    ]
    await nextTick()

    expect(state.tableData.value).toEqual(props.data)
    expect(beforePageChange).not.toHaveBeenCalled()
  })

  it('still resets editing state when remote query params change', async () => {
    const props = reactive<ProTableProps<Row, { keyword?: string }>>({
      columns: [],
      request: async () => ({ data: [], total: 0 }),
      params: {},
      pagination: true,
      autoRequest: true
    })
    const { beforePageChange } = setup(props as ProTableProps<Row, Record<string, never>>)
    await nextTick()
    const initialCalls = beforePageChange.mock.calls.length

    props.params = { keyword: 'updated' }
    await nextTick()

    expect(beforePageChange).toHaveBeenCalledTimes(initialCalls + 1)
  })

  it('ignores recreated pagination objects until page values actually change', async () => {
    const props = reactive<ProTableProps<Row, Record<string, never>>>({
      columns: [],
      request: async () => ({ data: [], total: 0 }),
      params: {},
      pagination: { current: 1, pageSize: 10 },
      autoRequest: true
    })
    const { state, beforePageChange } = setup(props)
    await nextTick()
    const initialCalls = beforePageChange.mock.calls.length

    props.pagination = { current: 1, pageSize: 10 }
    await nextTick()
    expect(beforePageChange).toHaveBeenCalledTimes(initialCalls)

    props.pagination = { current: 2, pageSize: 10 }
    await nextTick()
    expect(beforePageChange).toHaveBeenCalledTimes(initialCalls + 1)
    expect(state.pageInfo.value).toEqual({ current: 2, pageSize: 10 })
  })

  it('includes controlled server sorting and filters in request params', async () => {
    const request = vi.fn(async () => ({ data: [], total: 0 }))
    const props = reactive<ProTableProps<Row, { keyword?: string }>>({
      columns: [],
      request,
      params: { keyword: 'demo' },
      pagination: { current: 2, pageSize: 20 },
      autoRequest: false
    })
    const { state } = setup(props as ProTableProps<Row, Record<string, never>>)

    await state.setSorter({ key: 'name', field: 'user_name', order: 'descending' }, false)
    await state.setFilters({ status: ['active'] }, false)
    await state.refresh()

    expect(request).toHaveBeenCalledWith(
      {
        keyword: 'demo',
        current: 1,
        pageSize: 20,
        sorter: { key: 'name', field: 'user_name', order: 'descending' },
        filters: { status: ['active'] }
      },
      expect.objectContaining({ signal: expect.any(AbortSignal), attempt: 0 })
    )
    expect(state.getServerState()).toEqual({
      current: 1,
      pageSize: 20,
      sorter: { key: 'name', field: 'user_name', order: 'descending' },
      filters: { status: ['active'] }
    })
  })

  it('uses restored URL pagination for the first request without resetting it', async () => {
    const storage = createStorage()
    storage.setItem(
      'orders-table',
      JSON.stringify({ current: 7, pageSize: 100, filters: { status: ['storage'] } })
    )
    vi.stubGlobal('window', {
      location: {
        pathname: '/orders',
        search: '?orders.current=3&orders.pageSize=25',
        hash: ''
      },
      history: {
        state: null,
        replaceState: vi.fn(),
        pushState: vi.fn()
      },
      localStorage: createStorage(),
      sessionStorage: storage,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
    const request = vi.fn(async () => ({ data: [], total: 0 }))
    const props = reactive<ProTableProps<Row, Record<string, never>>>({
      columns: [],
      request,
      pagination: true,
      autoRequest: true,
      urlState: { key: 'orders' },
      statePersistence: { key: 'orders-table' }
    })

    const { state, beforePageChange } = setup(props)

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ current: 3, pageSize: 25 }),
      expect.any(Object)
    )
    expect(state.pageInfo.value).toEqual({ current: 3, pageSize: 25 })
    expect(beforePageChange).not.toHaveBeenCalled()
  })

  it('writes the initial server state when URL synchronization has no saved state', () => {
    const replaceState = vi.fn()
    vi.stubGlobal('window', {
      location: { pathname: '/orders', search: '?tab=all', hash: '' },
      history: { state: null, replaceState, pushState: vi.fn() },
      localStorage: createStorage(),
      sessionStorage: createStorage(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
    const props = reactive<ProTableProps<Row, Record<string, never>>>({
      columns: [],
      request: async () => ({ data: [], total: 0 }),
      pagination: true,
      autoRequest: false,
      urlState: { key: 'orders' }
    })

    setup(props)

    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/orders?tab=all&orders.current=1&orders.pageSize=10'
    )
  })

  it('maps only server filters and supports aliases in nested columns', () => {
    const filters = resolveProTableServerFilters<Row>(
      [
        {
          key: 'group',
          children: [
            { key: 'status', serverFilter: 'state' },
            { key: 'category', serverFilter: true }
          ]
        },
        { key: 'name' }
      ],
      {
        status: ['active'],
        category: ['internal'],
        name: ['demo']
      }
    )

    expect(filters).toEqual({
      state: ['active'],
      category: ['internal']
    })
  })
})

function createStorage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() {
      return values.size
    },
    clear: () => values.clear(),
    getItem: key => values.get(key) ?? null,
    key: index => [...values.keys()][index] ?? null,
    removeItem: key => values.delete(key),
    setItem: (key, value) => values.set(key, value)
  }
}
