import { definePropType } from '@/utils'
import type { ExtractPropTypes } from 'vue'
import { FormSchema } from './types/form'
import { ElFormInstance } from './types'

export type FormItem = FormSchema

export type { FormSchema }

export const formProps = {
  fields: {
    type: definePropType<FormSchema[]>(Array),
    default: () => []
  },
  inline: {
    type: Boolean,
    default: true
  },
  model: {
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
  [emitsEnums.GET_INSTANCE]: (instance: ElFormInstance | null): boolean => true,
  [emitsEnums.SUBMIT]: (values: Record<string, any>): boolean => true,
  [emitsEnums.RESET]: (values: Record<string, any>): boolean => true
}

export type FormProps = ExtractPropTypes<typeof formProps>
