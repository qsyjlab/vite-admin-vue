import type { ComponentSize } from 'element-plus'
import type { Ref } from 'vue'
import type { ProOption, ProOptionFieldPath, ProOptionFields } from '../shared/pro-option'
import type {
  ProRequestContext,
  ProRequestControl,
  ProRequestExecuteOptions
} from '../shared/pro-request'

export type ProSelectOption = ProOption
export type ProSelectValue = string | number | boolean | Record<string, unknown>
export type ProSelectParams = object

export type ProSelectModelValue<TValue extends ProSelectValue, TMultiple extends boolean> =
  | (TMultiple extends true ? TValue[] : TValue)
  | undefined

export type ProSelectFieldPath<TOption extends object> = ProOptionFieldPath<TOption>

export interface ProSelectFields<TOption extends object> extends ProOptionFields<TOption> {
  options: ProSelectFieldPath<TOption>
}

export interface ProSelectRequestQuery {
  keyword?: string
}

export interface ProSelectProps<
  TOption extends object = ProSelectOption,
  TValue extends ProSelectValue = ProSelectValue,
  TMultiple extends boolean = false,
  TParams extends ProSelectParams = ProSelectParams
> {
  modelValue?: ProSelectModelValue<TValue, TMultiple>
  options?: TOption[]
  size?: ComponentSize
  multiple?: TMultiple
  clearable?: boolean
  remote?: boolean
  loading?: boolean
  group?: boolean
  fields?: Partial<ProSelectFields<TOption>>
  filterable?: boolean
  params?: TParams
  request?: (
    params: TParams & ProSelectRequestQuery,
    context: ProRequestContext
  ) => Promise<TOption[]>
  requestDebounce?: number
  requestRetry?: number
  requestRetryDelay?: ProRequestExecuteOptions['retryDelay']
  cache?: boolean
  cacheKey?: string
  cacheTime?: number
  remoteMethod?: (query: string) => void | Promise<void>
  keywordKey?: string
  popperClass?: string
  teleported?: boolean
}

export interface ProSelectExpose<
  TOption extends object = ProSelectOption,
  TParams extends ProSelectParams = ProSelectParams
> extends ProRequestControl<TOption[]> {
  selectRef: Ref<unknown>
  loading: Readonly<Ref<boolean>>
  options: Readonly<Ref<TOption[]>>
  reload: (params?: Partial<TParams> & ProSelectRequestQuery, force?: boolean) => Promise<TOption[]>
  clearCache: () => void
  clearOptions: () => void
  focus: () => void
  blur: () => void
}

export type ProSelectInstance<
  TOption extends object = ProSelectOption,
  TParams extends ProSelectParams = ProSelectParams
> = ProSelectExpose<TOption, TParams>
