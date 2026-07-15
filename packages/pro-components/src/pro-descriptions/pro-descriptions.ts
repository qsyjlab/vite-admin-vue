import type { ProOption, ProOptionFields } from '../shared/pro-option'
import type { VNodeChild } from 'vue'
import type { ProFieldProps } from '../pro-field'
import type { ProDataIndex, ProLiteralUnion } from '../shared/pro-path'
import type {
  ProRequestContext,
  ProRequestControl,
  ProRequestExecuteOptions
} from '../shared/pro-request'

export type ProDescriptionsBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ProDescriptionsResponsiveNumber =
  | number
  | Partial<Record<ProDescriptionsBreakpoint, number>>

export interface ProDescriptionsRenderScope<
  TRecord extends object,
  TValue = unknown,
  TOption extends object = ProOption
> {
  data: TRecord
  value: TValue | undefined
  column: ProDescriptionsColumn<TRecord, TValue, TOption>
}

export interface ProDescriptionsCopyConfig<TRecord extends object, TValue = unknown> {
  text?: string | ((scope: ProDescriptionsRenderScope<TRecord, TValue>) => string)
  successText?: string
}

export interface ProDescriptionsColumn<
  TRecord extends object,
  TValue = unknown,
  TOption extends object = ProOption
> {
  key: ProLiteralUnion<string>
  dataIndex?: ProDataIndex<TRecord>
  label?: string
  group?: string
  span?: ProDescriptionsResponsiveNumber
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  labelAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  hide?: boolean | ((data: TRecord) => boolean)
  tooltip?: string
  copyable?: boolean | ProDescriptionsCopyConfig<TRecord, TValue>
  valueType?: ProFieldProps<TValue, TOption>['valueType']
  valueEnum?: ProFieldProps<TValue, TOption>['valueEnum']
  options?: TOption[]
  optionFields?: Partial<ProOptionFields<TOption>>
  fieldProps?: ProFieldProps<TValue, TOption>['fieldProps']
  emptyText?: string
  formatter?: ProFieldProps<TValue, TOption>['formatter']
  renderLabel?: (scope: ProDescriptionsRenderScope<TRecord, TValue, TOption>) => VNodeChild
  render?: (scope: ProDescriptionsRenderScope<TRecord, TValue, TOption>) => VNodeChild
}

export type ProDescriptionColumns<TRecord extends object = Record<string, unknown>> =
  ProDescriptionsColumn<TRecord>[]

export type ProDescriptionsRequest<TRecord extends object, TParams extends object> = (
  params: TParams,
  context: ProRequestContext
) => Promise<TRecord>

export interface ProDescriptionsProps<
  TRecord extends object,
  TParams extends object = Record<string, never>
> {
  data?: TRecord
  columns?: ProDescriptionColumns<TRecord>
  request?: ProDescriptionsRequest<TRecord, TParams>
  params?: TParams
  autoRequest?: boolean
  requestDebounce?: number
  requestRetry?: number
  requestRetryDelay?: ProRequestExecuteOptions['retryDelay']
  loading?: boolean
  title?: string
  border?: boolean
  column?: ProDescriptionsResponsiveNumber
  direction?: 'horizontal' | 'vertical'
  size?: 'large' | 'default' | 'small'
  labelWidth?: string | number
  groupTitles?: Record<string, string>
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  collapsedRows?: ProDescriptionsResponsiveNumber
  emptyText?: string
  errorText?: string | ((error: unknown) => string)
  retryText?: string
}

export interface ProDescriptionsExpose<
  TRecord extends object,
  TParams extends object = Record<string, never>
> extends ProRequestControl<TRecord | undefined> {
  reload: (params?: TParams) => Promise<TRecord | undefined>
  getData: () => TRecord | undefined
  setData: (data?: TRecord) => void
  getLoading: () => boolean
  getCollapsed: () => boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapse: () => void
}

export type ProDescriptionsInstance<
  TRecord extends object,
  TParams extends object = Record<string, never>
> = ProDescriptionsExpose<TRecord, TParams>
