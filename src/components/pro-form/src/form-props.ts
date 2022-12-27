import { definePropType } from '@/utils'
import type { FormInstance, FormItemRule, ColProps } from 'element-plus'
import type { Component, ExtractPropTypes } from 'vue'

export interface FormItem {
  label?: string
  el?: Component | string
  key: string
  attrs?: Record<string, any>
  rules?: FormItemRule[]
  layoutCol?: Partial<ColProps>
}

export const formProps = {
  fields: {
    type: definePropType<FormItem[]>(Array),
    default: () => []
  },
  inline: {
    type: Boolean,
    default: true
  },
  value: {
    type: definePropType<Record<string, any>>(Object),
    default: () => ({})
  }
}

export const emitsEnums = {
  GET_INSTANCE: 'get-instance',
  SUBMIT: 'submit',
  RESET: 'reset'
} as const

// [Vue warn]:  Invalid event arguments: event validation failed for event
// so, A value must be returned
export const formEmits = {
  [emitsEnums.GET_INSTANCE]: (instance: FormInstance | null): boolean => true,
  [emitsEnums.SUBMIT]: (values: Record<string, any>): boolean => true,
  [emitsEnums.RESET]: (values: Record<string, any>): boolean => true
}

export type FormProps = ExtractPropTypes<typeof formProps>
