import { computed, ref, watch, type Ref } from 'vue'
import type {
  ProTableColumn,
  ProTableColumnsState,
  ProTableOptions,
  ProTablePageInfo
} from '../pro-table'
import {
  applyProTableColumnState,
  createProTableColumnState,
  getProTableColumnKey
} from '../pro-table-utils'

interface UseProTableColumnsOptions<TRecord extends object> {
  columns: () => ProTableColumn<TRecord>[]
  indexBorder: () => boolean | Partial<ProTableColumn<TRecord>>
  pageInfo: Ref<ProTablePageInfo>
  columnsState: () => ProTableColumnsState
  tableOptions: () => boolean | ProTableOptions | undefined
}

export interface ProTableColumnSettingNode {
  key: string
  title?: string
  children?: ProTableColumnSettingNode[]
}

export function createProTableColumnSettingTree<TRecord extends object>(
  columns: ProTableColumn<TRecord>[],
  columnState: Record<string, { order?: number }>
): ProTableColumnSettingNode[] {
  return columns
    .map((column, index) => ({
      key: getProTableColumnKey(column),
      title: column.title,
      order: columnState[getProTableColumnKey(column)]?.order ?? index,
      children: column.children?.length
        ? createProTableColumnSettingTree(column.children, columnState)
        : undefined
    }))
    .sort((left, right) => left.order - right.order)
    .map(({ order: _order, ...column }) => column)
}

export function reorderProTableColumnState<TState extends Record<string, { order?: number }>>(
  state: TState,
  keys: string[]
): TState {
  return keys.reduce(
    (result, key, order) => ({
      ...result,
      [key]: { ...result[key], order }
    }),
    { ...state }
  )
}

export function useProTableColumns<TRecord extends object>(
  options: UseProTableColumnsOptions<TRecord>
) {
  const columnStateMap = ref(createProTableColumnState(options.columns()))
  const sourceColumns = computed<ProTableColumn<TRecord>[]>(() => {
    const indexBorder = options.indexBorder()
    if (!indexBorder) return options.columns()
    const indexColumn: ProTableColumn<TRecord> = {
      key: '__index__',
      title: '序号',
      width: 72,
      align: 'center',
      render: ({ index }) =>
        (options.pageInfo.value.current - 1) * options.pageInfo.value.pageSize + index + 1,
      ...(typeof indexBorder === 'object' ? indexBorder : {})
    }
    return [indexColumn, ...options.columns()]
  })
  const visibleColumns = computed(() =>
    applyProTableColumnState(sourceColumns.value, columnStateMap.value)
  )
  const configurableColumns = computed(() =>
    createProTableColumnSettingTree(sourceColumns.value, columnStateMap.value)
  )
  const toolbarOptions = computed(() => {
    const config = options.tableOptions() ?? true
    if (config === false) return { reload: false, density: false, setting: false }
    return {
      reload: true,
      density: true,
      setting: true,
      ...(config === true ? {} : config)
    }
  })

  watch(
    sourceColumns,
    columns => {
      columnStateMap.value = {
        ...createProTableColumnState(columns),
        ...readPersistedColumnState(),
        ...options.columnsState().value
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => options.columnsState().value,
    value => {
      if (value) columnStateMap.value = { ...columnStateMap.value, ...value }
    },
    { deep: true }
  )

  watch(
    columnStateMap,
    state => {
      persistColumnState(state)
      options.columnsState().onChange?.({ ...state })
    },
    { deep: true }
  )

  function setColumnVisible(key: string, show: boolean) {
    columnStateMap.value[key] = { ...columnStateMap.value[key], show }
  }

  function mergeColumnsMap(state: typeof columnStateMap.value) {
    columnStateMap.value = { ...columnStateMap.value, ...state }
  }

  function getColumnMapConfig(key: string) {
    return columnStateMap.value[key] ?? { show: true }
  }

  function reorderColumns(keys: string[]) {
    columnStateMap.value = reorderProTableColumnState(columnStateMap.value, keys)
  }

  function setColumnFixed(key: string, fixed: 'left' | 'right' | undefined) {
    columnStateMap.value[key] = { ...columnStateMap.value[key], fixed }
  }

  function resetColumnState() {
    columnStateMap.value = createProTableColumnState(sourceColumns.value)
    const storage = getColumnStateStorage()
    const key = options.columnsState().persistenceKey
    if (storage && key) storage.removeItem(key)
  }

  function getColumnStateStorage() {
    if (typeof window === 'undefined') return undefined
    return window[options.columnsState().persistenceType ?? 'localStorage']
  }

  function readPersistedColumnState() {
    const storage = getColumnStateStorage()
    const key = options.columnsState().persistenceKey
    if (!storage || !key) return {}
    try {
      return JSON.parse(storage.getItem(key) ?? '{}') as typeof columnStateMap.value
    } catch {
      return {}
    }
  }

  function persistColumnState(state: typeof columnStateMap.value) {
    const storage = getColumnStateStorage()
    const key = options.columnsState().persistenceKey
    if (storage && key) storage.setItem(key, JSON.stringify(state))
  }

  return {
    columnStateMap,
    sourceColumns,
    visibleColumns,
    configurableColumns,
    toolbarOptions,
    setColumnVisible,
    mergeColumnsMap,
    getColumnMapConfig,
    reorderColumns,
    setColumnFixed,
    resetColumnState
  }
}
