import type { ComponentSize } from 'element-plus'
import type { Ref } from 'vue'
import type { ProOption, ProOptionFields } from '../shared/pro-option'

export type ProCheckboxValue = string | number

export type ProCheckboxOptionType = 'default' | 'button'

export interface ProCheckboxGroupProps<
  TOption extends object = ProOption,
  TValue extends ProCheckboxValue = ProCheckboxValue
> {
  modelValue?: TValue[]
  options?: TOption[]
  fields?: Partial<ProOptionFields<TOption>>
  optionType?: ProCheckboxOptionType
  size?: ComponentSize
  disabled?: boolean
  min?: number
  max?: number
}

export interface ProCheckboxGroupExpose<TValue extends ProCheckboxValue = ProCheckboxValue> {
  groupRef: Ref<unknown>
  value: Readonly<Ref<TValue[]>>
  focus: () => void
  blur: () => void
}

export type ProCheckboxGroupInstance<TValue extends ProCheckboxValue = ProCheckboxValue> =
  ProCheckboxGroupExpose<TValue>
