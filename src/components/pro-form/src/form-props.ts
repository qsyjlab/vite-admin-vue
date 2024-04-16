import { definePropType } from '@/utils'
import type { ExtractPropTypes } from 'vue'
import { FormMethodsType, FormSchema } from './types/form'
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [emitsEnums.REGISTER]: (instance: FormMethodsType | null): boolean => true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [emitsEnums.SUBMIT]: (values: Record<string, any>): boolean => true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [emitsEnums.RESET]: (values: Record<string, any>): boolean => true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [emitsEnums.EFFECT]: (newVal: Record<string, any>, oldVal: Record<string, any>): boolean => true
}

export type FormProps = ExtractPropTypes<typeof formProps>
