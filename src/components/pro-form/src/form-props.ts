import { definePropType } from '@/utils'
import type { ExtractPropTypes } from 'vue'
import { FormMethodsType, FormSchema } from './types/form'
export type FormItem = FormSchema

export type { FormSchema }

export const formProps = {
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
  }
}

export const emitsEnums = {
  REGISTER: 'register',
  SUBMIT: 'submit',
  RESET: 'reset'
} as const

// [Vue warn]:  Invalid event arguments: event validation failed for event
// so, A value must be returned
export const formEmits = {
  [emitsEnums.REGISTER]: (instance: FormMethodsType | null): boolean => true,
  [emitsEnums.SUBMIT]: (values: Record<string, any>): boolean => true,
  [emitsEnums.RESET]: (values: Record<string, any>): boolean => true
}

export type FormProps = ExtractPropTypes<typeof formProps>
