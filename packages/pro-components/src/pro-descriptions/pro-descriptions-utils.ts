import { getProPathValue } from '../shared/pro-path'
import type {
  ProDescriptionsBreakpoint,
  ProDescriptionsColumn,
  ProDescriptionsResponsiveNumber
} from './pro-descriptions'

const BREAKPOINT_MIN_WIDTH: Record<Exclude<ProDescriptionsBreakpoint, 'xs'>, number> = {
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1920
}

export interface ProDescriptionsColumnGroup<TRecord extends object> {
  key: string
  title?: string
  columns: ProDescriptionsColumn<TRecord>[]
}

export function getProDescriptionsValue<TRecord extends object>(
  data: TRecord | undefined,
  column: ProDescriptionsColumn<TRecord>
) {
  if (!data || column.dataIndex === undefined) return undefined
  return getProPathValue(data, column.dataIndex)
}

export function getVisibleProDescriptionsColumns<TRecord extends object>(
  columns: ProDescriptionsColumn<TRecord>[],
  data?: TRecord
) {
  return columns.filter(column =>
    typeof column.hide === 'function' ? !data || !column.hide(data) : !column.hide
  )
}

export function getProDescriptionsBreakpoint(width: number): ProDescriptionsBreakpoint {
  if (width >= BREAKPOINT_MIN_WIDTH.xl) return 'xl'
  if (width >= BREAKPOINT_MIN_WIDTH.lg) return 'lg'
  if (width >= BREAKPOINT_MIN_WIDTH.md) return 'md'
  if (width >= BREAKPOINT_MIN_WIDTH.sm) return 'sm'
  return 'xs'
}

export function resolveProDescriptionsResponsiveNumber(
  value: ProDescriptionsResponsiveNumber | undefined,
  width: number,
  fallback: number
) {
  if (typeof value === 'number') return normalizePositiveInteger(value, fallback)
  if (!value) return fallback

  const breakpoint = getProDescriptionsBreakpoint(width)
  const candidates: ProDescriptionsBreakpoint[] = ['xs']
  if (breakpoint !== 'xs') candidates.push('sm')
  if (breakpoint === 'md' || breakpoint === 'lg' || breakpoint === 'xl') candidates.push('md')
  if (breakpoint === 'lg' || breakpoint === 'xl') candidates.push('lg')
  if (breakpoint === 'xl') candidates.push('xl')

  let result: number | undefined
  candidates.forEach(key => {
    if (value[key] !== undefined) result = value[key]
  })
  return normalizePositiveInteger(result ?? fallback, fallback)
}

export function getCollapsedProDescriptionsColumns<TRecord extends object>(
  columns: ProDescriptionsColumn<TRecord>[],
  columnCount: number,
  collapsedRows: number
) {
  let row = 1
  let usedSpan = 0
  let count = 0

  for (const column of columns) {
    const span = normalizeSpan(column.span, columnCount)
    if (usedSpan > 0 && usedSpan + span > columnCount) {
      row += 1
      usedSpan = 0
    }
    if (row > collapsedRows) break
    usedSpan += span
    count += 1
  }

  return columns.slice(0, count || Math.min(1, columns.length))
}

export function groupProDescriptionsColumns<TRecord extends object>(
  columns: ProDescriptionsColumn<TRecord>[],
  groupTitles: Record<string, string> = {}
): ProDescriptionsColumnGroup<TRecord>[] {
  const groups = new Map<string, ProDescriptionsColumnGroup<TRecord>>()

  columns.forEach(column => {
    const key = column.group || '__default__'
    const group = groups.get(key) ?? {
      key,
      title: key === '__default__' ? undefined : (groupTitles[key] ?? key),
      columns: []
    }
    group.columns.push(column)
    groups.set(key, group)
  })

  return Array.from(groups.values())
}

export function resolveProDescriptionsColumnSpan<TRecord extends object>(
  column: ProDescriptionsColumn<TRecord>,
  width: number,
  columnCount: number
): ProDescriptionsColumn<TRecord> {
  return {
    ...column,
    span: normalizeSpan(resolveProDescriptionsResponsiveNumber(column.span, width, 1), columnCount)
  }
}

export function getProDescriptionsErrorText(
  error: unknown,
  errorText?: string | ((error: unknown) => string)
) {
  if (typeof errorText === 'function') return errorText(error)
  if (errorText) return errorText
  if (error instanceof Error) return error.message
  return '详情加载失败，请稍后重试'
}

function normalizeSpan(value: ProDescriptionsResponsiveNumber | undefined, columnCount: number) {
  const span = typeof value === 'number' ? value : 1
  return Math.min(columnCount, normalizePositiveInteger(span, 1))
}

function normalizePositiveInteger(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return Math.max(1, Math.floor(value))
}
