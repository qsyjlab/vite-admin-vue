import { FormProps } from '@/components/pro-form/src/form-props'
import { FormSchema } from '@/components/pro-form/src/types'
import { DialogProps } from 'element-plus'

export interface IDialogForm<T = Record<string, any>, D = Record<string, any>>
  extends Partial<Omit<DialogProps, 'modelValue'>> {
  fields?: FormSchema[]
  formProps?: Partial<FormProps>
  cancelText?: string
  confirmText?: string
  addRequest?: (data: T) => Promise<any>
  editRequest?: (id: number | string, data: T) => Promise<any>
  getRequest?: (id: number | string) => Promise<D>
  onSuccess?: (response?: D) => void
}

export interface IDialogExpose {
  show: () => void
  close: () => void
}
