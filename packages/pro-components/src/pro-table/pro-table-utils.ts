import { getProPathValue, normalizeProPath } from '../shared/pro-path'
import type {
  ProTableColumn,
  ProTableColumnState,
  ProTablePageInfo,
  ProTableRequestResult,
  ProTableRowKey
} from './pro-table'

export function getProTableColumnKey<TRecord extends object>(column: ProTableColumn<TRecord>) {
  return String(column.key)
}

export function getProTableColumnProp<TRecord extends object>(column: ProTableColumn<TRecord>) {
  if (column.dataIndex === undefined) return undefined
  return normalizeProPath(column.dataIndex).join('.')
}

export function getProTableRowKey<TRecord extends object>(
  row: TRecord,
  rowKey: ProTableRowKey<TRecord>
): string | number | undefined {
  return typeof rowKey === 'function' ? rowKey(row) : getProPathValue<string | number>(row, rowKey)
}

export function paginateProTableData<TRecord extends object>(
  data: TRecord[],
  pageInfo: ProTablePageInfo
) {
  const start = (pageInfo.current - 1) * pageInfo.pageSize
  return data.slice(start, start + pageInfo.pageSize)
}

export function moveProTableRow<TRecord>(data: TRecord[], oldIndex: number, newIndex: number) {
  if (
    oldIndex === newIndex ||
    oldIndex < 0 ||
    newIndex < 0 ||
    oldIndex >= data.length ||
    newIndex >= data.length
  ) {
    return [...data]
  }

  const next = [...data]
  const [row] = next.splice(oldIndex, 1)
  next.splice(newIndex, 0, row)
  return next
}

export function normalizeProTableResponse<TRecord extends object>(
  response: ProTableRequestResult<TRecord>
): ProTableRequestResult<TRecord> {
  return {
    data: Array.isArray(response.data) ? response.data : [],
    total: Number.isFinite(response.total) ? response.total : 0,
    success: response.success
  }
}

export function applyProTableColumnState<TRecord extends object>(
  columns: ProTableColumn<TRecord>[],
  state: Record<string, ProTableColumnState>
): ProTableColumn<TRecord>[] {
  return columns
    .map((column, index) => ({ column, index, config: state[getProTableColumnKey(column)] }))
    .filter(item => item.config?.show !== false && !item.column.hideInTable)
    .sort(
      (left, right) => (left.config?.order ?? left.index) - (right.config?.order ?? right.index)
    )
    .map(({ column, config }) => ({
      ...column,
      fixed: config?.fixed ?? column.fixed,
      children: column.children ? applyProTableColumnState(column.children, state) : column.children
    }))
}

export function createProTableColumnState<TRecord extends object>(
  columns: ProTableColumn<TRecord>[]
): Record<string, ProTableColumnState> {
  return columns.reduce<Record<string, ProTableColumnState>>((result, column, index) => {
    result[getProTableColumnKey(column)] = {
      show: !column.hideInTable,
      order: index,
      fixed: column.fixed
    }
    return Object.assign(result, createProTableColumnState(column.children ?? []))
  }, {})
}
