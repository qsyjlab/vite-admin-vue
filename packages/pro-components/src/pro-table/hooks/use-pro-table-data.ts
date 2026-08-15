import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type Ref
} from 'vue'
import type { ProConfigProviderContext } from '../../pro-config-provider/pro-config-provider'
import { resolveProConfigProviderPopperClass } from '../../pro-config-provider/pro-config-provider-utils'
import { isProRequestAbort, useProRequest } from '../../shared/pro-request'
import type {
  ProTableFilters,
  ProTablePageInfo,
  ProTableProps,
  ProTableRequestLifecycle,
  ProTableRequestParams,
  ProTableRequestResult,
  ProTableServerState,
  ProTableSorter
} from '../pro-table'
import { normalizeProTableResponse, paginateProTableData } from '../pro-table-utils'
import {
  readProTableUrlState,
  resolveProTableUrlState,
  writeProTableUrlState
} from '../pro-table-url-state'

interface UseProTableDataOptions<TRecord extends object, TQuery extends object, TResponse> {
  props: ProTableProps<TRecord, TQuery, TResponse>
  proConfig: ProConfigProviderContext
  currentSize: Ref<'large' | 'default' | 'small' | undefined>
  beforePageChange: () => void
  afterLoad: () => void | Promise<void>
  onLoadingChange: (loading: boolean) => void
  onPageChange: (pageInfo: ProTablePageInfo) => void
  onSorterChange: (sorter?: ProTableSorter) => void
  onFiltersChange: (filters: ProTableFilters) => void
  onRequestStateChange: (lifecycle: ProTableRequestLifecycle) => void
  onRequestError: (error: unknown) => void
}

export function useProTableData<
  TRecord extends object,
  TQuery extends object,
  TResponse = ProTableRequestResult<TRecord>
>(options: UseProTableDataOptions<TRecord, TQuery, TResponse>) {
  const { props } = options
  const tableData = shallowRef<TRecord[]>([])
  const total = ref(0)
  const pageInfo = ref<ProTablePageInfo>({
    current: typeof props.pagination === 'object' ? (props.pagination.current ?? 1) : 1,
    pageSize: typeof props.pagination === 'object' ? (props.pagination.pageSize ?? 10) : 10
  })
  const sorter = shallowRef<ProTableSorter>()
  const filters = shallowRef<ProTableFilters>({})
  const requestState = useProRequest<TResponse>()
  const restoredUrlState = restoreUrlState()
  if (!restoredUrlState) {
    restorePersistedState()
    syncUrlState()
  }
  let requestWatcherInitialized = false
  const mergedLoading = computed(() => props.loading ?? requestState.loading.value)
  const requestLifecycle = computed<ProTableRequestLifecycle>(() => ({
    phase: requestState.phase.value,
    action: requestState.action.value,
    loading: mergedLoading.value,
    initialLoading: requestState.initialLoading.value,
    refreshing: requestState.refreshing.value
  }))
  const requestError = computed(() => requestState.error.value)
  const paginationProps = computed(() => {
    const config = typeof props.pagination === 'object' ? props.pagination : {}
    return {
      pageSizes: config.pageSizes ?? [10, 20, 50, 100],
      layout: Array.isArray(config.layout)
        ? config.layout.join(',')
        : (config.layout ?? 'total, sizes, prev, pager, next, jumper'),
      background: config.background ?? true,
      small: config.small ?? options.currentSize.value === 'small',
      popperClass: resolveProConfigProviderPopperClass(
        options.proConfig.value.dark,
        config.popperClass
      ),
      teleported: config.teleported ?? true
    }
  })

  watch(requestState.loading, options.onLoadingChange, { immediate: true })
  watch(requestLifecycle, lifecycle => options.onRequestStateChange({ ...lifecycle }), {
    immediate: true
  })
  watch(
    [() => props.request, () => props.params],
    () => {
      const shouldLoad = !props.request || props.autoRequest !== false
      if (!requestWatcherInitialized) {
        requestWatcherInitialized = true
        if (shouldLoad) void loadData('initial').catch(ignoreRequestAbort)
        return
      }
      if (shouldLoad) void reload(true).catch(ignoreRequestAbort)
    },
    { deep: true, immediate: true }
  )
  watch(
    [
      () => props.pagination !== false,
      () => (typeof props.pagination === 'object' ? props.pagination.current : undefined),
      () => (typeof props.pagination === 'object' ? props.pagination.pageSize : undefined)
    ],
    ([enabled, current, pageSize], [previousEnabled, previousCurrent, previousPageSize]) => {
      if (
        enabled === previousEnabled &&
        current === previousCurrent &&
        pageSize === previousPageSize
      ) {
        return
      }

      options.beforePageChange()
      pageInfo.value = {
        current: current ?? pageInfo.value.current,
        pageSize: pageSize ?? pageInfo.value.pageSize
      }
      persistServerState()
      if (props.autoRequest !== false) void loadData('page').catch(ignoreRequestAbort)
    }
  )
  watch(
    () => props.data,
    () => {
      if (!props.request) void loadData('refresh').catch(ignoreRequestAbort)
    },
    { deep: true }
  )
  onMounted(() => window.addEventListener('popstate', handlePopState))
  onBeforeUnmount(() => {
    window.removeEventListener('popstate', handlePopState)
    requestState.cancel()
  })

  function createRequestParams(): ProTableRequestParams<TQuery> {
    const params = {
      ...props.params,
      ...pageInfo.value,
      sorter: sorter.value,
      filters: filters.value
    } as ProTableRequestParams<TQuery>
    const transformParams = props.transformParams ?? options.proConfig.value.table?.transformParams
    return transformParams ? (transformParams(params) as ProTableRequestParams<TQuery>) : params
  }

  async function loadData(action: ProTableRequestLifecycle['action'] = 'refresh') {
    if (!props.request) {
      const source = [...(props.data ?? [])]
      tableData.value = props.pagination ? paginateProTableData(source, pageInfo.value) : source
      total.value = source.length
      await nextTick(options.afterLoad)
      return tableData.value
    }

    try {
      const response = await requestState.execute(props.request, createRequestParams(), {
        action,
        debounce: props.requestDebounce,
        retry: props.requestRetry,
        retryDelay: props.requestRetryDelay
      })
      if (requestState.data.value !== response) return tableData.value
      const responseAdapter =
        props.responseAdapter ?? options.proConfig.value.table?.responseAdapter
      const result = responseAdapter
        ? (responseAdapter(response) as ProTableRequestResult<TRecord>)
        : normalizeProTableResponse(response as ProTableRequestResult<TRecord>)
      tableData.value = result.data
      total.value = result.total
      await nextTick(options.afterLoad)
      return tableData.value
    } catch (error) {
      if (!isProRequestAbort(error)) options.onRequestError(error)
      throw error
    }
  }

  async function reload(resetPage = true) {
    if (resetPage) {
      pageInfo.value = { ...pageInfo.value, current: 1 }
      options.beforePageChange()
      emitPageInfo()
      persistServerState()
    }
    return loadData(requestState.data.value === undefined ? 'initial' : 'reload')
  }

  function refresh() {
    return loadData('refresh')
  }

  function retryRequest() {
    return loadData('retry')
  }

  async function setPageInfo(nextPageInfo: Partial<ProTablePageInfo>, reloadData = true) {
    options.beforePageChange()
    pageInfo.value = { ...pageInfo.value, ...nextPageInfo }
    emitPageInfo()
    persistServerState()
    return reloadData ? loadData('page') : tableData.value
  }

  async function handleCurrentChange(current: number) {
    await setPageInfo({ current })
  }

  async function handleSizeChange(pageSize: number) {
    await setPageInfo({ current: 1, pageSize })
  }

  async function setSorter(nextSorter?: ProTableSorter, reloadData = true) {
    sorter.value = nextSorter
    pageInfo.value = { ...pageInfo.value, current: 1 }
    options.beforePageChange()
    options.onSorterChange(nextSorter ? { ...nextSorter } : undefined)
    emitPageInfo()
    persistServerState()
    return reloadData ? loadData('reload') : tableData.value
  }

  async function setFilters(nextFilters: ProTableFilters, reloadData = true) {
    filters.value = cloneFilters(nextFilters)
    pageInfo.value = { ...pageInfo.value, current: 1 }
    options.beforePageChange()
    options.onFiltersChange(cloneFilters(filters.value))
    emitPageInfo()
    persistServerState()
    return reloadData ? loadData('reload') : tableData.value
  }

  async function resetServerState(reloadData = true) {
    sorter.value = undefined
    filters.value = {}
    pageInfo.value = { ...pageInfo.value, current: 1 }
    options.beforePageChange()
    options.onSorterChange(undefined)
    options.onFiltersChange({})
    emitPageInfo()
    persistServerState()
    return reloadData ? loadData('reload') : tableData.value
  }

  function emitPageInfo() {
    options.onPageChange({ ...pageInfo.value })
  }

  function getServerState(): ProTableServerState {
    return {
      ...pageInfo.value,
      sorter: sorter.value ? { ...sorter.value } : undefined,
      filters: cloneFilters(filters.value)
    }
  }

  function restorePersistedState() {
    const config = props.statePersistence
    if (!config || config.restore === false || typeof window === 'undefined') return
    try {
      const raw = getStorage(config.type)?.getItem(config.key)
      if (!raw) return
      const state = JSON.parse(raw) as Partial<ProTableServerState>
      if (config.pagination !== false && state.current && state.pageSize) {
        pageInfo.value = { current: state.current, pageSize: state.pageSize }
      }
      if (config.sorter !== false) sorter.value = state.sorter
      if (config.filters !== false && state.filters) filters.value = cloneFilters(state.filters)
    } catch {
      getStorage(config.type)?.removeItem(config.key)
    }
  }

  function restoreUrlState() {
    const config = resolveProTableUrlState(props.urlState)
    if (!config || typeof window === 'undefined') return false
    const state = readProTableUrlState(window.location.search, config)
    if (!state) return false
    applyServerState(state)
    return true
  }

  function applyServerState(state: Partial<ProTableServerState>) {
    pageInfo.value = {
      current: state.current ?? pageInfo.value.current,
      pageSize: state.pageSize ?? pageInfo.value.pageSize
    }
    sorter.value = state.sorter
    filters.value = cloneFilters(state.filters ?? {})
  }

  function handlePopState() {
    if (!restoreUrlState()) return
    options.beforePageChange()
    emitPageInfo()
    options.onSorterChange(sorter.value ? { ...sorter.value } : undefined)
    options.onFiltersChange(cloneFilters(filters.value))
    persistStorageState()
    if (props.autoRequest !== false) void loadData('reload').catch(ignoreRequestAbort)
  }

  function persistServerState() {
    persistStorageState()
    syncUrlState()
  }

  function persistStorageState() {
    const config = props.statePersistence
    if (!config || typeof window === 'undefined') return
    const state = getServerState()
    getStorage(config.type)?.setItem(
      config.key,
      JSON.stringify({
        ...(config.pagination === false
          ? {}
          : { current: state.current, pageSize: state.pageSize }),
        ...(config.sorter === false ? {} : { sorter: state.sorter }),
        ...(config.filters === false ? {} : { filters: state.filters })
      })
    )
  }

  function syncUrlState() {
    const config = resolveProTableUrlState(props.urlState)
    if (!config || typeof window === 'undefined') return
    const search = writeProTableUrlState(window.location.search, getServerState(), config)
    const nextUrl = `${window.location.pathname}${search}${window.location.hash}`
    const method = config.history === 'push' ? 'pushState' : 'replaceState'
    window.history[method](window.history.state, '', nextUrl)
  }

  return {
    tableData,
    total,
    pageInfo,
    sorter,
    filters,
    mergedLoading,
    requestLifecycle,
    requestError,
    paginationProps,
    getServerState,
    getRequestLifecycle: () => ({ ...requestLifecycle.value }),
    getError: () => requestError.value,
    retryRequest,
    cancelRequest: requestState.cancel,
    reload,
    refresh,
    setPageInfo,
    setSorter,
    setFilters,
    resetServerState,
    handleCurrentChange,
    handleSizeChange
  }
}

function cloneFilters(filters: ProTableFilters): ProTableFilters {
  return Object.fromEntries(Object.entries(filters).map(([key, values]) => [key, [...values]]))
}

function ignoreRequestAbort(error: unknown) {
  if (!isProRequestAbort(error)) throw error
}

function getStorage(type: 'localStorage' | 'sessionStorage' = 'sessionStorage') {
  return typeof window === 'undefined' ? undefined : window[type]
}
