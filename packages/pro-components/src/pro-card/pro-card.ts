import type { CSSProperties } from 'vue'

export type ProCardBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ProCardResponsiveColumns = number | Partial<Record<ProCardBreakpoint, number>>

export interface ProCardProps<TMeta extends object = Record<string, never>> {
  title?: string
  subtitle?: string
  meta?: TMeta
  bordered?: boolean
  shadow?: 'always' | 'hover' | 'never'
  loading?: boolean
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  headerBordered?: boolean
  split?: boolean
  direction?: 'horizontal' | 'vertical'
  columns?: ProCardResponsiveColumns
  gap?: number | string
  bodyPadding?: number | string | boolean
  bodyStyle?: CSSProperties
}

export interface ProCardExpose {
  getCollapsed: () => boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapse: () => void
}

export type ProCardInstance = ProCardExpose

export type ProStatisticTrend = 'up' | 'down' | 'flat'

export interface ProStatisticCardProps<TValue extends string | number = number>
  extends Omit<ProCardProps, 'title'> {
  title?: string
  value?: TValue
  precision?: number
  prefix?: string
  suffix?: string
  description?: string
  trend?: ProStatisticTrend
  trendValue?: string | number
  formatter?: (value: TValue | undefined) => string
}
