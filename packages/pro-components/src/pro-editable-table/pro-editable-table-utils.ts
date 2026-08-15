import type {
  ProTableColumn,
  ProTableColumns,
  ProTableEditableRowKey,
  ProTableRowKey
} from '../pro-table'
import { getProTableRowKey } from '../pro-table/pro-table-utils'

export function applyProEditableTableColumnDefaults<TRecord extends object>(
  columns: ProTableColumns<TRecord>,
  operationKey: string
): ProTableColumns<TRecord> {
  return columns.map(column => {
    const operation = String(column.key) === operationKey
    return {
      ...column,
      editable: operation ? false : (column.editable ?? true),
      children: column.children
        ? applyProEditableTableColumnDefaults(column.children, operationKey)
        : undefined
    }
  })
}

export function hasProEditableTableColumn<TRecord extends object>(
  columns: ProTableColumn<TRecord>[],
  columnKey: string
): boolean {
  return columns.some(
    column =>
      String(column.key) === columnKey ||
      hasProEditableTableColumn(column.children ?? [], columnKey)
  )
}

export function createProEditableTableNewRowTracker<TRecord extends object>(
  rowKey: () => ProTableRowKey<TRecord>
) {
  const keys = new Set<ProTableEditableRowKey>()

  function getKey(row: TRecord) {
    return getProTableRowKey(row, rowKey())
  }

  function add(row: TRecord) {
    const key = getKey(row)
    if (key === undefined) throw new Error('Editable row key is undefined')
    keys.add(key)
    return key
  }

  function release(key: ProTableEditableRowKey) {
    return keys.delete(key)
  }

  function remove(data: TRecord[], key: ProTableEditableRowKey) {
    if (!release(key)) return { data, removed: false }
    return {
      data: data.filter(row => getKey(row) !== key),
      removed: true
    }
  }

  function sync(data: TRecord[]) {
    const currentKeys = new Set(data.map(getKey))
    for (const key of keys) {
      if (!currentKeys.has(key)) keys.delete(key)
    }
  }

  return {
    add,
    release,
    remove,
    sync,
    has: (key: ProTableEditableRowKey) => keys.has(key)
  }
}
