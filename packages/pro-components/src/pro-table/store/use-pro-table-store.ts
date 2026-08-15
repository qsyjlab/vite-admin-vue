import { computed, nextTick, ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { TableInstance } from 'element-plus'
import type { ProConfigProviderContext } from '../../pro-config-provider'
import { useProTableColumns } from '../hooks/use-pro-table-columns'
import { useProTableData } from '../hooks/use-pro-table-data'
import { useProTableDragSort } from '../hooks/use-pro-table-drag-sort'
import { useProTableEditable } from '../hooks/use-pro-table-editable'
import { useProTableHeight } from '../hooks/use-pro-table-height'
import { useProTableSelection } from '../hooks/use-pro-table-selection'
import type {
  ProTableDragSortEnd,
  ProTableExpose,
  ProTablePageInfo,
  ProTablePagination,
  ProTableProps,
  ProTableFilters,
  ProTableRequestLifecycle,
  ProTableRequestResult,
  ProTableSorter
} from '../pro-table'

export interface ProTableStoreEmitMap<TRecord extends object> {
  'update:loading': [loading: boolean]
  'update:selectedKeys': [keys: Array<string | number>]
  'selection-change': [rows: TRecord[]]
  'page-change': [current: number, pageSize: number]
  'pagination-change': [pageInfo: ProTablePageInfo]
  'update:pagination': [pagination: ProTablePagination]
  'sort-change': [sorter: ProTableSorter | undefined]
  'filter-change': [filters: ProTableFilters]
  'request-state-change': [lifecycle: ProTableRequestLifecycle]
  'request-error': [error: unknown]
  'update:data': [data: TRecord[]]
  'editable-change': [data: TRecord[]]
  'drag-sort-end': [event: ProTableDragSortEnd<TRecord>]
}

type ProTableStoreEmit<TRecord extends object> = <
  TEvent extends keyof ProTableStoreEmitMap<TRecord>
>(
  event: TEvent,
  ...args: ProTableStoreEmitMap<TRecord>[TEvent]
) => void

interface UseProTableStoreOptions<TRecord extends object, TQuery extends object, TResponse> {
  props: ProTableProps<TRecord, TQuery, TResponse>
  emit: ProTableStoreEmit<TRecord>
  proConfig: ProConfigProviderContext
}

export function useProTableStore<
  TRecord extends object,
  TQuery extends object,
  TResponse = ProTableRequestResult<TRecord>
>(options: UseProTableStoreOptions<TRecord, TQuery, TResponse>) {
  const { props, emit, proConfig } = options
  const wrapperRef = ref<HTMLDivElement>()
  const toolbarRef = ref<HTMLDivElement>()
  const alertRef = ref<HTMLDivElement>()
  const paginationRef = ref<HTMLDivElement>()
  const tableRef = ref<TableInstance>()
  const currentSize = ref<'small' | 'default' | 'large' | undefined>(
    normalizeSize(props.size ?? proConfig.value.table?.size ?? proConfig.value.size)
  )
  let clearEditing: () => void = () => undefined
  let syncSelection: () => Promise<void> = async () => undefined

  const dataState = useProTableData({
    props,
    proConfig,
    currentSize,
    beforePageChange: () => clearEditing(),
    afterLoad: () => syncSelection(),
    onLoadingChange: loading => emit('update:loading', loading),
    onPageChange: pageInfo => {
      emit('page-change', pageInfo.current, pageInfo.pageSize)
      emit('pagination-change', pageInfo)
      emit('update:pagination', {
        ...(typeof props.pagination === 'object' ? props.pagination : {}),
        ...pageInfo
      })
    },
    onSorterChange: sorter => emit('sort-change', sorter),
    onFiltersChange: filters => emit('filter-change', filters),
    onRequestStateChange: lifecycle => emit('request-state-change', lifecycle),
    onRequestError: error => emit('request-error', error)
  })
  const columnsState = useProTableColumns({
    columns: () => props.columns,
    indexBorder: () => props.indexBorder ?? true,
    pageInfo: dataState.pageInfo,
    columnsState: () => props.columnsState ?? {},
    tableOptions: () => props.options ?? proConfig.value.table?.options
  })
  const editableState = useProTableEditable({
    data: dataState.tableData,
    columns: () => columnsState.visibleColumns.value,
    rowKey: () => props.rowKey ?? 'id',
    editable: () => props.editable,
    onChange: data => {
      emit('update:data', data)
      emit('editable-change', data)
    }
  })
  clearEditing = editableState.clearEditRows
  const selectionState = useProTableSelection({
    data: dataState.tableData,
    tableRef,
    rowKey: () => props.rowKey ?? 'id',
    checkable: () => props.checkable ?? false,
    reserveSelection: () => props.reserveSelection ?? false,
    selectedKeys: () => props.selectedKeys ?? [],
    cacheSelectedData: () => props.cacheSelectedData ?? [],
    onChange: (keys, rows) => {
      emit('update:selectedKeys', keys)
      emit('selection-change', rows)
    }
  })
  syncSelection = selectionState.syncVisibleSelection
  const heightState = useProTableHeight({
    enabled: () => props.autoFitHeight ?? false,
    height: () => props.height,
    tableRef,
    wrapperRef,
    occupiedRefs: [toolbarRef, alertRef, paginationRef],
    dependencies: () => [
      props.pagination,
      props.size,
      selectionState.selectedKeyList.value.length,
      dataState.tableData.value.length
    ]
  })
  const dragSortState = useProTableDragSort({
    dragSort: () => props.dragSort,
    data: dataState.tableData,
    columns: columnsState.visibleColumns,
    tableRef,
    onChange: payload => {
      emit('update:data', payload.data)
      emit('drag-sort-end', payload)
    }
  })

  const showToolbar = computed(
    () =>
      Boolean(props.headerTitle) ||
      Boolean(
        columnsState.toolbarOptions.value.reload ||
          columnsState.toolbarOptions.value.density ||
          columnsState.toolbarOptions.value.setting
      )
  )
  const resolvedCustomRenderAfter = computed(
    () => props.customRenderAfter ?? proConfig.value.table?.customRenderAfter
  )
  const resolvedRowKey = computed(() => {
    const rowKey = props.rowKey ?? 'id'
    return typeof rowKey === 'string' ? rowKey : (row: TRecord) => String(rowKey(row))
  })

  watch(
    [() => props.size, () => proConfig.value.table?.size, () => proConfig.value.size],
    ([size, tableSize, providerSize]) =>
      (currentSize.value = normalizeSize(size ?? tableSize ?? providerSize))
  )

  function setTableSize(size: 'small' | 'default' | 'large') {
    currentSize.value = size
    void nextTick(() => tableRef.value?.doLayout())
  }

  async function handleTableSortChange(payload: {
    column?: { columnKey?: string; property?: string }
    prop?: string
    order?: 'ascending' | 'descending' | null
  }) {
    const key = payload.column?.columnKey
    const column = key ? findColumn(props.columns, key) : undefined
    if (!column?.serverSort) return
    const field =
      typeof column.serverSort === 'string'
        ? column.serverSort
        : (payload.prop ?? payload.column?.property)
    await dataState.setSorter(
      payload.order && key ? { key, field, order: payload.order } : undefined
    )
  }

  async function handleTableFilterChange(nextFilters: Record<string, unknown[]>) {
    const serverFilters = resolveProTableServerFilters(props.columns, nextFilters)
    await dataState.setFilters({ ...dataState.filters.value, ...serverFilters })
  }

  const exposed: ProTableExpose<TRecord> = {
    getTable: () => tableRef.value,
    getData: () => cloneDeep(dataState.tableData.value),
    getLoading: () => dataState.mergedLoading.value,
    getPageInfo: () => ({ ...dataState.pageInfo.value }),
    getTotal: () => dataState.total.value,
    getServerState: dataState.getServerState,
    getRequestLifecycle: dataState.getRequestLifecycle,
    getError: dataState.getError,
    retryRequest: dataState.retryRequest,
    cancelRequest: dataState.cancelRequest,
    getSelectedKeys: () => [...selectionState.selectedKeyList.value],
    reload: dataState.reload,
    refresh: dataState.refresh,
    setPageInfo: dataState.setPageInfo,
    setSorter: dataState.setSorter,
    setFilters: dataState.setFilters,
    resetServerState: dataState.resetServerState,
    clearSelection: selectionState.clearSelection,
    clearSelectedKeys: selectionState.clearSelection,
    getSelectedRows: selectionState.getSelectedRows,
    doLayout: () => tableRef.value?.doLayout(),
    doHeight: heightState.measureTableHeight,
    startEditable: editableState.startEditable,
    cancelEditable: editableState.cancelEditable,
    saveEditable: editableState.saveEditable,
    deleteEditable: editableState.deleteEditable,
    clearEditRows: editableState.clearEditRows,
    hasEditingRow: editableState.hasEditingRow,
    getEditableKeys: editableState.getEditableKeys,
    validateEditable: editableState.validateEditable,
    saveAllEditable: editableState.saveAllEditable,
    cancelAllEditable: editableState.cancelAllEditable,
    getRowEditableState: editableState.getRowEditableState,
    editableCellUtils: {
      startEditable: editableState.startEditable,
      cancelEditable: editableState.cancelEditable,
      saveEditable: editableState.saveEditable,
      deleteEditable: editableState.deleteEditable,
      clearEditRow: editableState.clearEditRows,
      hasEditingRow: editableState.hasEditingRow,
      getEditableKeys: editableState.getEditableKeys,
      validateEditable: editableState.validateEditable,
      saveAllEditable: editableState.saveAllEditable,
      cancelAllEditable: editableState.cancelAllEditable,
      getRowEditableState: editableState.getRowEditableState
    },
    columnsSettingUtils: {
      mergeColumnsMap: columnsState.mergeColumnsMap,
      resetColumnsMap: columnsState.resetColumnState,
      getColumnMapConfig: columnsState.getColumnMapConfig
    }
  }

  return {
    wrapperRef,
    toolbarRef,
    alertRef,
    paginationRef,
    tableRef,
    currentSize,
    showToolbar,
    resolvedCustomRenderAfter,
    resolvedRowKey,
    setTableSize,
    handleTableSortChange,
    handleTableFilterChange,
    exposed,
    ...dataState,
    ...columnsState,
    ...editableState,
    ...selectionState,
    ...heightState,
    resolvedDragSort: dragSortState.config,
    dragSortReady: dragSortState.ready,
    isDragHandleColumn: dragSortState.isDragHandleColumn
  }
}

function findColumn<TRecord extends object>(
  columns: import('../pro-table').ProTableColumns<TRecord>,
  key: string
): import('../pro-table').ProTableColumn<TRecord> | undefined {
  for (const column of columns) {
    if (String(column.key) === key) return column
    const child = column.children ? findColumn(column.children, key) : undefined
    if (child) return child
  }
  return undefined
}

export function resolveProTableServerFilters<TRecord extends object>(
  columns: import('../pro-table').ProTableColumns<TRecord>,
  filters: Record<string, unknown[]>
): ProTableFilters {
  return Object.fromEntries(
    Object.entries(filters).flatMap(([key, values]) => {
      const column = findColumn(columns, key)
      if (!column?.serverFilter) return []
      const filterKey = typeof column.serverFilter === 'string' ? column.serverFilter : key
      return [[filterKey, [...values]]]
    })
  )
}

function normalizeSize(size: '' | 'small' | 'default' | 'large' | undefined) {
  return size || undefined
}
