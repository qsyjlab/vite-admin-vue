import { definePropType } from '@/utils'
import type { ExtractPropTypes } from 'vue'
import { FormMethodsType, FormSchema } from './types/form'

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
  },
  /** 是否启用 effect emit */
  enableEffect: {
    type: Boolean,
    default: false
  }
}

export const emitsEnums = {
  REGISTER: 'register',
  SUBMIT: 'submit',
  RESET: 'reset',
  EFFECT: 'effect'
} as const

/**
 * [Vue warn]:  Invalid event arguments: event validation failed for event .so, A value must be returned
 * 场景中需要透传 emits，使得 emits 能在某些函数内部调动，但是 vue3.3的 emits ts 模式下的类型无法被其他的函数作为类型使用
 */
export const formEmits = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [emitsEnums.REGISTER]: (instance: FormMethodsType | null): boolean => true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [emitsEnums.SUBMIT]: (values: Record<string, any>): boolean => true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [emitsEnums.RESET]: (values: Record<string, any>): boolean => true,
  [emitsEnums.EFFECT]: (values: Record<string, any>): boolean => !!values
}

export type FormProps = ExtractPropTypes<typeof formProps>
