import type { CSSProperties, VNodeChild } from 'vue'

export type ProCheckCardValue = string | number | boolean

export interface ProCheckCardOption<TValue extends ProCheckCardValue = ProCheckCardValue> {
  value: TValue
  title: string
  description?: string
  avatar?: string
  disabled?: boolean
  loading?: boolean
}

export interface ProCheckCardProps<TValue extends ProCheckCardValue = ProCheckCardValue>
  extends ProCheckCardOption<TValue> {
  modelValue?: TValue | TValue[]
  multiple?: boolean
  bodyStyle?: CSSProperties
  selectionRole?: 'radio' | 'checkbox'
  tabindex?: number
}

export interface ProCheckCardExpose {
  focus: () => void
}

export interface ProCheckCardSlots {
  avatar?: () => VNodeChild
  title?: () => VNodeChild
  description?: () => VNodeChild
  extra?: () => VNodeChild
  default?: () => VNodeChild
}
