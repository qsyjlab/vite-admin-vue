import { cloneDeep, isPlainObject } from 'lodash-es'
import type { ColProps } from 'element-plus'
import type { FormModel } from '../pro-form'
import type { ProTableColumn } from '../pro-table'
import type { ProTableSearchColumn, ProTableSearchField } from './pro-table-search'

export const PRO_TABLE_SEARCH_DEFAULT_COL: Partial<ColProps> = {
  span: 8,
  xs: 24,
  sm: 12,
  md: 8
}

export function compactProTableSearchValues<TValue>(source: TValue): TValue {
  if (Array.isArray(source)) {
    return source
      .map(value => compactProTableSearchValues(value))
      .filter(value => !isProTableSearchEmpty(value)) as TValue
  }
  if (!isPlainObject(source)) return source

  return Object.entries(source as Record<string, unknown>).reduce<Record<string, unknown>>(
    (result, [key, value]) => {
      const compacted = compactProTableSearchValues(value)
      if (!isProTableSearchEmpty(compacted)) result[key] = compacted
      return result
    },
    {}
  ) as TValue
}

export function isProTableSearchEmpty(value: unknown) {
  if (value === undefined || value === null || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (isPlainObject(value)) return Object.keys(value as object).length === 0
  return false
}

export function columnsToSearchFields<TRecord extends object, TQuery extends FormModel>(
  columns: ProTableSearchColumn<TRecord, TQuery>[]
): ProTableSearchField<TQuery>[] {
  return columns
    .flatMap(column => [column, ...flattenSearchColumns(column.children ?? [])])
    .map(columnToSearchField)
    .filter((field): field is ProTableSearchField<TQuery> => Boolean(field))
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
}

export function splitProTableSearchColumns<TRecord extends object, TQuery extends FormModel>(
  columns: ProTableSearchColumn<TRecord, TQuery>[]
) {
  return {
    columns: columns.map(stripSearchColumn),
    searchFields: columnsToSearchFields(columns)
  }
}

export function columnToSearchField<TRecord extends object, TQuery extends FormModel>(
  column: ProTableSearchColumn<TRecord, TQuery>
): ProTableSearchField<TQuery> | undefined {
  if (column.search === false || (column.search === undefined && column.searchName === undefined)) {
    return undefined
  }
  const overrides = typeof column.search === 'object' ? cloneDeep(column.search) : {}
  const name = overrides.name ?? column.searchName ?? column.dataIndex
  if (name === undefined) return undefined

  return {
    key: overrides.key ?? `search-${String(column.key)}`,
    name: name as ProTableSearchField<TQuery>['name'],
    label: overrides.label ?? String(column.title ?? column.key),
    valueType:
      overrides.valueType ??
      (typeof column.valueType === 'function' ? undefined : column.valueType) ??
      'text',
    valueEnum:
      overrides.valueEnum ??
      (typeof column.valueEnum === 'function' ? undefined : column.valueEnum),
    fieldProps: overrides.fieldProps ?? column.fieldProps,
    col: overrides.col ?? { ...PRO_TABLE_SEARCH_DEFAULT_COL },
    ...overrides
  }
}

function flattenSearchColumns<TRecord extends object, TQuery extends FormModel>(
  columns: ProTableSearchColumn<TRecord, TQuery>[]
): ProTableSearchColumn<TRecord, TQuery>[] {
  return columns.flatMap(column => [column, ...flattenSearchColumns(column.children ?? [])])
}

function stripSearchColumn<TRecord extends object, TQuery extends FormModel>(
  column: ProTableSearchColumn<TRecord, TQuery>
): ProTableColumn<TRecord> {
  const { search: _search, searchName: _searchName, children, ...tableColumn } = column
  return {
    ...tableColumn,
    children: children?.map(stripSearchColumn)
  }
}
