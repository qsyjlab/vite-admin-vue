import type { ComponentSize } from 'element-plus'
import type { VNodeChild } from 'vue'
import type { ProCardResponsiveColumns } from '../pro-card'
import type { ProDataIndex } from '../shared/pro-path'
import type {
  ProRequestContext,
  ProRequestControl,
  ProRequestExecuteOptions
} from '../shared/pro-request'

export interface ProListPageInfo {
  current: number
  pageSize: number
}

export type ProListRequestParams<TQuery extends object> = TQuery & ProListPageInfo

export interface ProListRequestResult<TRecord extends object> {
  data: TRecord[]
  total: number
  success?: boolean
}

export type ProListRowKey<TRecord extends object> =
  | ProDataIndex<TRecord>
  | ((record: TRecord) => string | number)

export type ProListValueGetter<TRecord extends object, TValue = unknown> =
  | ProDataIndex<TRecord>
  | ((record: TRecord, index: number) => TValue)

export interface ProListItemMeta<TRecord extends object> {
  title?: ProListValueGetter<TRecord, VNodeChild>
  description?: ProListValueGetter<TRecord, VNodeChild>
  avatar?: ProListValueGetter<TRecord, string>
  content?: ProListValueGetter<TRecord, VNodeChild>
}

export interface ProListPagination extends Partial<ProListPageInfo> {
  pageSizes?: number[]
  layout?: string | string[]
  background?: boolean
  small?: boolean
  popperClass?: string
  teleported?: boolean
}

export interface ProListProps<
  TRecord extends object,
  TQuery extends object,
  TResponse = ProListRequestResult<TRecord>
> {
  data?: TRecord[]
  request?: (params: ProListRequestParams<TQuery>, context: ProRequestContext) => Promise<TResponse>
  params?: TQuery
  responseAdapter?: (response: TResponse) => ProListRequestResult<TRecord>
  transformParams?: (params: ProListRequestParams<TQuery>) => ProListRequestParams<TQuery>
  autoRequest?: boolean
  requestDebounce?: number
  requestRetry?: number
  requestRetryDelay?: ProRequestExecuteOptions['retryDelay']
  loading?: boolean
  pagination?: boolean | ProListPagination
  rowKey?: ProListRowKey<TRecord>
  itemMeta?: ProListItemMeta<TRecord>
  layout?: 'list' | 'grid'
  gridColumns?: ProCardResponsiveColumns
  gap?: number | string
  size?: ComponentSize
  bordered?: boolean
  split?: boolean
  selectable?: boolean
  selectedKeys?: Array<string | number>
  reserveSelection?: boolean
  emptyText?: string
  errorText?: string | ((error: unknown) => string)
  retryText?: string
}

export interface ProListExpose<TRecord extends object> extends ProRequestControl<TRecord[]> {
  reload: (resetPage?: boolean) => Promise<TRecord[]>
  refresh: () => Promise<TRecord[]>
  getData: () => TRecord[]
  getLoading: () => boolean
  getTotal: () => number
  getPageInfo: () => ProListPageInfo
  setPageInfo: (pageInfo: Partial<ProListPageInfo>, reload?: boolean) => Promise<TRecord[]>
  getSelectedKeys: () => Array<string | number>
  getSelectedRows: () => TRecord[]
  clearSelection: () => void
}

export type ProListInstance<TRecord extends object> = ProListExpose<TRecord>
