import type { ComponentSize } from 'element-plus'
import type { Ref } from 'vue'
import type { ProChoiceValue, ProOption, ProOptionFields } from '../shared/pro-option'

export type ProRadioOptionType = 'default' | 'button'

export interface ProRadioGroupProps<
  TOption extends object = ProOption,
  TValue extends ProChoiceValue = ProChoiceValue
> {
  modelValue?: TValue
  options?: TOption[]
  fields?: Partial<ProOptionFields<TOption>>
  optionType?: ProRadioOptionType
  size?: ComponentSize
  disabled?: boolean
}

export interface ProRadioGroupExpose<TValue extends ProChoiceValue = ProChoiceValue> {
  groupRef: Ref<unknown>
  value: Readonly<Ref<TValue | undefined>>
  focus: () => void
  blur: () => void
}

export type ProRadioGroupInstance<TValue extends ProChoiceValue = ProChoiceValue> =
  ProRadioGroupExpose<TValue>
