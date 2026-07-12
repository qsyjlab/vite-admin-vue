import type { Component, Ref } from 'vue'
import type { TagProps } from 'element-plus'
import type {
  ProChoiceValue,
  ProOption,
  ProOptionFields,
  ProOptionFieldPath
} from '../shared/pro-option'
import type { ProLiteralUnion } from '../shared/pro-path'

export type ProFieldMode = 'read' | 'edit'

export type ProFieldBuiltinValueType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'money'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'enum'
  | 'tag'
  | 'status'
  | 'progress'
  | 'image'
  | 'upload'

export interface ProFieldValueTypeConfig {
  type: ProLiteralUnion<ProFieldBuiltinValueType>
  currency?: string
  locale?: string
  precision?: number
  dateFormat?: string
}

export type ProFieldValueType = ProLiteralUnion<ProFieldBuiltinValueType> | ProFieldValueTypeConfig

export interface ProFieldValueEnumItem {
  text?: string
  color?: string
  type?: TagProps['type']
  disabled?: boolean
}

export type ProFieldValueEnumValue = string | number | ProFieldValueEnumItem

export type ProFieldValueEnum =
  | Record<string, ProFieldValueEnumValue>
  | Map<ProChoiceValue, ProFieldValueEnumValue>

export interface ProFieldProps<TValue = unknown, TOption extends object = ProOption> {
  modelValue?: TValue
  mode?: ProFieldMode
  valueType?: ProFieldValueType
  valueEnum?: ProFieldValueEnum
  options?: TOption[]
  optionFields?: Partial<ProOptionFields<TOption>>
  fieldProps?: Record<string, unknown>
  emptyText?: string
  disabled?: boolean
  readonly?: boolean
  block?: boolean
  formatter?: (value: TValue, context: ProFieldRenderContext<TValue, TOption>) => unknown
}

export interface ProFieldRenderContext<TValue = unknown, TOption extends object = ProOption> {
  value: TValue | undefined
  mode: ProFieldMode
  valueType: ProFieldValueTypeConfig
  valueEnum?: ProFieldValueEnum
  options: TOption[]
  optionFields: ProOptionFields<TOption>
  fieldProps: Record<string, unknown>
  updateValue: (value: TValue | undefined) => void
}

export interface ProFieldRendererDefinition {
  read?: Component
  edit?: Component
}

export interface ProFieldExpose<TValue = unknown> {
  fieldRef: Ref<HTMLElement | undefined>
  value: Readonly<Ref<TValue | undefined>>
  focus: () => void
  blur: () => void
}

export type ProFieldInstance<TValue = unknown> = ProFieldExpose<TValue>

export type ProFieldOptionPath<TOption extends object> = ProOptionFieldPath<TOption>
