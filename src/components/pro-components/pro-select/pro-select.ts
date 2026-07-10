import type { ComponentSize } from 'element-plus'
import type { Ref } from 'vue'
import type { ProLiteralUnion, ProPathSegment } from '../shared/pro-path'

export type ProSelectOption = Record<string, unknown>
export type ProSelectValue = string | number | boolean | Record<string, unknown>
export type ProSelectParams = Record<string, unknown>

export type ProSelectModelValue<TValue extends ProSelectValue, TMultiple extends boolean> =
  | (TMultiple extends true ? TValue[] : TValue)
  | undefined

export type ProSelectFieldPath<TOption extends object> =
  | ProLiteralUnion<Extract<keyof TOption, string>>
  | readonly ProPathSegment[]

export interface ProSelectFields<TOption extends object> {
  label: ProSelectFieldPath<TOption>
  value: ProSelectFieldPath<TOption>
  options: ProSelectFieldPath<TOption>
  disabled: ProSelectFieldPath<TOption>
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
  /** @deprecated Use params. This alias will be removed after the compatibility release. */
  paramns?: TParams
  request?: (params: TParams & ProSelectRequestQuery) => Promise<TOption[]>
  remoteMethod?: (query: string) => void | Promise<void>
  keywordKey?: string
}

export interface ProSelectExpose<
  TOption extends object = ProSelectOption,
  TParams extends ProSelectParams = ProSelectParams
> {
  selectRef: Ref<unknown>
  loading: Readonly<Ref<boolean>>
  options: Readonly<Ref<TOption[]>>
  reload: (params?: Partial<TParams> & ProSelectRequestQuery) => Promise<TOption[]>
  clearOptions: () => void
  focus: () => void
  blur: () => void
}

export type ProSelectInstance<
  TOption extends object = ProSelectOption,
  TParams extends ProSelectParams = ProSelectParams
> = ProSelectExpose<TOption, TParams>
