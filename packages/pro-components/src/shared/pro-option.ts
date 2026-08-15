import { getProPathValue, type ProLiteralUnion, type ProPathSegment } from './pro-path'

/** 默认选项只约束为非原始值对象，业务 interface 无需额外声明字符串索引。 */
export type ProOption = object
export type ProChoiceValue = string | number | boolean

export type ProOptionFieldPath<TOption extends object> =
  | ProLiteralUnion<Extract<keyof TOption, string>>
  | readonly ProPathSegment[]

export interface ProOptionFields<TOption extends object> {
  label: ProOptionFieldPath<TOption>
  value: ProOptionFieldPath<TOption>
  disabled: ProOptionFieldPath<TOption>
}

export const DEFAULT_PRO_OPTION_FIELDS = {
  label: 'label',
  value: 'value',
  disabled: 'disabled'
} as const

export function getProOptionField<TOption extends object, TValue = unknown>(
  option: TOption,
  path: ProOptionFieldPath<TOption>
): TValue | undefined {
  return getProPathValue<TValue>(option, path)
}

export function getProOptionKey<TOption extends object>(
  option: TOption,
  valuePath: ProOptionFieldPath<TOption>,
  fallback: number
): string | number {
  const value = getProOptionField<TOption>(option, valuePath)
  return typeof value === 'string' || typeof value === 'number' ? value : fallback
}
