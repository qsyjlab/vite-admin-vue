import { definePropType } from '@/utils'
import type { ExtractPropTypes } from 'vue'
import type { FormMethodsType, FormSchema } from './types/form'
import type { FormProps as EpFormProps } from 'element-plus'
import { formProps as epFormProps } from 'element-plus'
export type { FormSchema }

export const formProps = {
  ...epFormProps,
  fields: {
    type: definePropType<FormSchema[]>(Array),
    default: () => []
  },
  inline: {
    type: Boolean,
    default: false
  },
  model: {
    type: definePropType<Record<string, any>>(Object),
    default: () => ({})
  },
  labelWidth: {
    type: definePropType<EpFormProps['labelWidth']>([String, Number])
  },
  /** 是否启用 effect emit */
  enableEffect: {
    type: Boolean,
    default: false
  },
  layout: {
    type: Boolean,
    default: true
  },
  actionProps: {
    type: definePropType<EpFormProps['labelWidth']>([String, Number])
  }
}

export const emitsEnums = {
  REGISTER: 'register',
  SUBMIT: 'submit',
  RESET: 'reset',
  EFFECT: 'effect'
} as const

export const formEmits = {
  [emitsEnums.REGISTER]: (_instance: FormMethodsType | null): boolean => true,

  [emitsEnums.SUBMIT]: (_values: Record<string, any>): boolean => true,

  [emitsEnums.RESET]: (_values: Record<string, any>): boolean => true,

  [emitsEnums.EFFECT]: (_newVal: Record<string, any>, _oldVal: Record<string, any>): boolean => true
}

export type FormProps = ExtractPropTypes<typeof formProps>
