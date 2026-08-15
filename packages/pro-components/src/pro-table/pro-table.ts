import type { TableColumnCtx, TableInstance, TableProps } from 'element-plus'
import type { Component, VNodeChild } from 'vue'
import type { ProFieldProps } from '../pro-field'
import type {
  ProRequestContext,
  ProRequestControl,
  ProRequestExecuteOptions,
  ProRequestLifecycle
} from '../shared/pro-request'
import type { ProDataIndex, ProLiteralUnion } from '../shared/pro-path'

export type ProTableRowKey<TRecord extends object> = string | ((row: TRecord) => string | number)

export interface ProTablePageInfo {
  current: number
  pageSize: number
}

export type ProTableSortOrder = 'ascending' | 'descending'

export interface ProTableSorter {
  key: string
  field?: string
  order: ProTableSortOrder
}

export type ProTableFilters = Record<string, unknown[]>

export interface ProTableServerState extends ProTablePageInfo {
  sorter?: ProTableSorter
  filters: ProTableFilters
}

export type ProTableRequestParams<TQuery extends object> = TQuery & ProTableServerState

export type ProTableRequestLifecycle = ProRequestLifecycle

export interface ProTableRequestResult<TRecord extends object> {
  data: TRecord[]
  total: number
  success?: boolean
}

export interface ProTableRenderScope<TRecord extends object, TValue = unknown> {
  row: TRecord
  value: TValue | undefined
  index: number
  column: ProTableColumn<TRecord, TValue>
  editableState?: ProTableEditableRowState<TRecord>
}

export type ProTableDynamicValue<TRecord extends object, TValue> =
  | TValue
  | ((scope: ProTableRenderScope<TRecord>) => TValue)

export type ProTableEditableRowKey = string | number

export interface ProTableEditableError {
  message: string
}

export type ProTableEditableErrors = Record<string, ProTableEditableError[]>

export interface ProTableEditableRule<TRecord extends object, TValue = unknown> {
  required?: boolean
  message?: string
  validator?: (
    value: TValue | undefined,
    row: TRecord,
    callback: (error?: string | Error) => void
  ) => void | boolean | string | Error | Promise<void | boolean | string | Error>
}

export interface ProTableEditRowComponent<TRecord extends object, TValue = unknown> {
  el: Component | string
  props?:
    | Record<string, unknown>
    | ((scope: ProTableRenderScope<TRecord, TValue>) => Record<string, unknown>)
  rules?: ProTableEditableRule<TRecord, TValue>[]
}

export interface ProTableEditableRowState<TRecord extends object> {
  isEdit: true
  data: TRecord
  errors: ProTableEditableErrors
}

export type ProTableEditableActionResult = void | boolean

export type ProTableEditableAction<
  TRecord extends object,
  TResult = ProTableEditableActionResult
> = (row: TRecord) => TResult | Promise<TResult>

export type ProTableEditableSaveAction<TRecord extends object> = ProTableEditableAction<
  TRecord,
  ProTableEditableActionResult | TRecord
>

export interface ProTableEditable<TRecord extends object> {
  mode?: 'single' | 'multiple'
  enableValidate?: boolean
  onSave?: ProTableEditableSaveAction<TRecord>
  onCancel?: ProTableEditableAction<TRecord>
  onDelete?: ProTableEditableAction<TRecord>
  onChange?: (data: TRecord[]) => void
  onError?: (errors: ProTableEditableErrors | undefined) => void
}

export interface ProTableColumn<TRecord extends object, TValue = unknown>
  extends Partial<
    Omit<
      TableColumnCtx<TRecord>,
      'children' | 'columnKey' | 'formatter' | 'label' | 'prop' | 'renderCell'
    >
  > {
  key: ProLiteralUnion<string>
  dataIndex?: ProDataIndex<TRecord>
  title?: string
  tip?: string
  hideInTable?: boolean
  serverSort?: boolean | string
  serverFilter?: boolean | string
  valueType?: ProTableDynamicValue<TRecord, ProFieldProps<TValue>['valueType']>
  valueEnum?: ProTableDynamicValue<TRecord, ProFieldProps<TValue>['valueEnum']>
  fieldProps?: ProFieldProps<TValue>['fieldProps']
  emptyText?: string
  formatter?: ProFieldProps<TValue>['formatter']
  editable?: boolean | ((scope: ProTableRenderScope<TRecord, TValue>) => boolean)
  editableRules?: ProTableEditableRule<TRecord, TValue>[]
  rowComponent?: ProTableEditRowComponent<TRecord, TValue>
  render?: (scope: ProTableRenderScope<TRecord, TValue>) => VNodeChild
  children?: ProTableColumn<TRecord>[]
}

export type ProTableColumns<TRecord extends object> = ProTableColumn<TRecord>[]

export interface ProTablePagination extends Partial<ProTablePageInfo> {
  total?: number
  pageSizes?: number[]
  layout?: string | string[]
  background?: boolean
  small?: boolean
  popperClass?: string
  teleported?: boolean
}

export interface ProTableColumnState {
  show?: boolean
  order?: number
  fixed?: TableColumnCtx<unknown>['fixed']
}

export interface ProTableColumnsState {
  value?: Record<string, ProTableColumnState>
  persistenceKey?: string
  persistenceType?: 'localStorage' | 'sessionStorage'
  onChange?: (state: Record<string, ProTableColumnState>) => void
}

export interface ProTableStatePersistence {
  key: string
  type?: 'localStorage' | 'sessionStorage'
  restore?: boolean
  pagination?: boolean
  sorter?: boolean
  filters?: boolean
}

export interface ProTableUrlState {
  key?: string
  history?: 'replace' | 'push'
  pagination?: boolean
  sorter?: boolean
  filters?: boolean
}

export interface ProTableOptions {
  reload?: boolean
  density?: boolean
  setting?: boolean
}

export interface ProTableDragSortEnd<TRecord extends object> {
  oldIndex: number
  newIndex: number
  row: TRecord
  data: TRecord[]
}

export interface ProTableDragSort<TRecord extends object> {
  disabled?: boolean
  handleColumnKey?: string
  animation?: number
  onEnd?: (event: ProTableDragSortEnd<TRecord>) => void
}

export interface ProTableProps<
  TRecord extends object,
  TQuery extends object,
  TResponse = ProTableRequestResult<TRecord>
> {
  columns: ProTableColumns<TRecord>
  data?: TRecord[]
  request?: (
    params: ProTableRequestParams<TQuery>,
    context: ProRequestContext
  ) => Promise<TResponse>
  params?: TQuery
  responseAdapter?: (response: TResponse) => ProTableRequestResult<TRecord>
  transformParams?: (params: ProTableRequestParams<TQuery>) => ProTableRequestParams<TQuery>
  pagination?: boolean | ProTablePagination
  autoRequest?: boolean
  requestDebounce?: number
  requestRetry?: number
  requestRetryDelay?: ProRequestExecuteOptions['retryDelay']
  loading?: boolean
  rowKey?: ProTableRowKey<TRecord>
  checkable?: boolean
  reserveSelection?: boolean
  selectedKeys?: Array<string | number>
  cacheSelectedData?: TRecord[]
  headerTitle?: string
  options?: boolean | ProTableOptions
  columnsState?: ProTableColumnsState
  statePersistence?: ProTableStatePersistence
  urlState?: boolean | ProTableUrlState
  indexBorder?: boolean | Partial<ProTableColumn<TRecord>>
  editable?: ProTableEditable<TRecord>
  dragSort?: boolean | ProTableDragSort<TRecord>
  customRenderAfter?: (value: VNodeChild, scope: ProTableRenderScope<TRecord>) => VNodeChild
  showAlert?: boolean
  alwaysShowAlert?: boolean
  autoFitHeight?: boolean
  height?: TableProps<TRecord>['height']
  size?: TableProps<TRecord>['size']
  border?: boolean
  tableLayout?: TableProps<TRecord>['tableLayout']
  emptyText?: string
  errorText?: string | ((error: unknown) => string)
  retryText?: string
}

export interface ProTableExpose<TRecord extends object> extends ProRequestControl<TRecord[]> {
  getTable: () => TableInstance | undefined
  getData: () => TRecord[]
  getLoading: () => boolean
  getPageInfo: () => ProTablePageInfo
  getTotal: () => number
  getServerState: () => ProTableServerState
  getSelectedKeys: () => Array<string | number>
  reload: (resetPage?: boolean) => Promise<TRecord[]>
  refresh: () => Promise<TRecord[]>
  setPageInfo: (pageInfo: Partial<ProTablePageInfo>, reload?: boolean) => Promise<TRecord[]>
  setSorter: (sorter?: ProTableSorter, reload?: boolean) => Promise<TRecord[]>
  setFilters: (filters: ProTableFilters, reload?: boolean) => Promise<TRecord[]>
  resetServerState: (reload?: boolean) => Promise<TRecord[]>
  clearSelection: () => void
  clearSelectedKeys: () => void
  getSelectedRows: () => TRecord[]
  doLayout: () => void
  doHeight: () => void
  startEditable: (rowKey: ProTableEditableRowKey) => boolean
  cancelEditable: (rowKey: ProTableEditableRowKey) => Promise<boolean>
  saveEditable: (rowKey: ProTableEditableRowKey) => Promise<boolean>
  deleteEditable: (rowKey: ProTableEditableRowKey) => Promise<boolean>
  clearEditRows: () => void
  hasEditingRow: () => boolean
  getEditableKeys: () => ProTableEditableRowKey[]
  validateEditable: (rowKey?: ProTableEditableRowKey) => Promise<boolean>
  saveAllEditable: () => Promise<boolean>
  cancelAllEditable: () => Promise<boolean>
  getRowEditableState: (
    rowKey: ProTableEditableRowKey
  ) => ProTableEditableRowState<TRecord> | undefined
  editableCellUtils: {
    startEditable: ProTableExpose<TRecord>['startEditable']
    cancelEditable: ProTableExpose<TRecord>['cancelEditable']
    saveEditable: ProTableExpose<TRecord>['saveEditable']
    deleteEditable: ProTableExpose<TRecord>['deleteEditable']
    clearEditRow: ProTableExpose<TRecord>['clearEditRows']
    hasEditingRow: ProTableExpose<TRecord>['hasEditingRow']
    getEditableKeys: ProTableExpose<TRecord>['getEditableKeys']
    validateEditable: ProTableExpose<TRecord>['validateEditable']
    saveAllEditable: ProTableExpose<TRecord>['saveAllEditable']
    cancelAllEditable: ProTableExpose<TRecord>['cancelAllEditable']
    getRowEditableState: ProTableExpose<TRecord>['getRowEditableState']
  }
  columnsSettingUtils: {
    mergeColumnsMap: (state: Record<string, ProTableColumnState>) => void
    resetColumnsMap: () => void
    getColumnMapConfig: (key: string) => ProTableColumnState
  }
}

export type ProTableInstance<TRecord extends object> = ProTableExpose<TRecord>
