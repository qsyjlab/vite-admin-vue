import type { ProCardBreakpoint, ProCardResponsiveColumns } from './pro-card'

const BREAKPOINT_MIN_WIDTH: Record<Exclude<ProCardBreakpoint, 'xs'>, number> = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
}

export function getProCardBreakpoint(width: number): ProCardBreakpoint {
  if (width >= BREAKPOINT_MIN_WIDTH.xl) return 'xl'
  if (width >= BREAKPOINT_MIN_WIDTH.lg) return 'lg'
  if (width >= BREAKPOINT_MIN_WIDTH.md) return 'md'
  if (width >= BREAKPOINT_MIN_WIDTH.sm) return 'sm'
  return 'xs'
}

export function resolveProCardColumns(
  columns: ProCardResponsiveColumns | undefined,
  width: number,
  fallback = 1
) {
  if (typeof columns === 'number') return Math.max(1, Math.floor(columns))
  if (!columns) return fallback

  const breakpoint = getProCardBreakpoint(width)
  const candidates: ProCardBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl']
  const activeIndex = candidates.indexOf(breakpoint)
  for (let index = activeIndex; index >= 0; index -= 1) {
    const value = columns[candidates[index]]
    if (value !== undefined) return Math.max(1, Math.floor(value))
  }
  return fallback
}

export function normalizeProCardSpacing(value: number | string | boolean | undefined) {
  if (value === false) return '0px'
  if (value === true || value === undefined) return '20px'
  return typeof value === 'number' ? `${value}px` : value
}
