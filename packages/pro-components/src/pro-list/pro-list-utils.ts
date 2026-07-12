import { getProPathValue } from '../shared/pro-path'
import type {
  ProListItemMeta,
  ProListPageInfo,
  ProListRequestResult,
  ProListRowKey,
  ProListValueGetter
} from './pro-list'

export function normalizeProListResponse<TRecord extends object>(
  response: ProListRequestResult<TRecord>
): ProListRequestResult<TRecord> {
  return {
    data: Array.isArray(response.data) ? response.data : [],
    total: Number.isFinite(response.total) ? response.total : 0,
    success: response.success
  }
}

export function paginateProListData<TRecord extends object>(
  data: TRecord[],
  pageInfo: ProListPageInfo
) {
  const start = (pageInfo.current - 1) * pageInfo.pageSize
  return data.slice(start, start + pageInfo.pageSize)
}

export function getProListRowKey<TRecord extends object>(
  record: TRecord,
  rowKey: ProListRowKey<TRecord>
) {
  return typeof rowKey === 'function'
    ? (rowKey as (record: TRecord) => string | number)(record)
    : getProPathValue<string | number>(record, rowKey)
}

export function getProListValue<TRecord extends object, TValue>(
  record: TRecord,
  index: number,
  getter?: ProListValueGetter<TRecord, TValue>
) {
  if (!getter) return undefined
  return typeof getter === 'function'
    ? (getter as (record: TRecord, index: number) => TValue)(record, index)
    : getProPathValue<TValue>(record, getter)
}

export function getProListItemValues<TRecord extends object>(
  record: TRecord,
  index: number,
  meta: ProListItemMeta<TRecord>
) {
  return {
    title: getProListValue(record, index, meta.title),
    description: getProListValue(record, index, meta.description),
    avatar: getProListValue(record, index, meta.avatar),
    content: getProListValue(record, index, meta.content)
  }
}

export function getProListErrorText(
  error: unknown,
  errorText?: string | ((error: unknown) => string)
) {
  if (typeof errorText === 'function') return errorText(error)
  if (errorText) return errorText
  return error instanceof Error ? error.message : '列表加载失败'
}
