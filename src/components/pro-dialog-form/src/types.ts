import { FormSchema, ProFormProps } from '@/components/pro-form/src/types'
import { DialogProps } from 'element-plus'

export interface IDialogFormProps<T = Record<string, any>, D = Record<string, any>>
  extends Partial<ProFormProps> {
  fields?: FormSchema[]
  dialogProps?: Partial<Omit<DialogProps, 'modelValue'>>
  cancelText?: string
  confirmText?: string
  addRequest?: (data: T) => Promise<any>
  editRequest?: (id: number | string, data: T) => Promise<any>
  getRequest?: (id: number | string) => Promise<D>
  handler?: (data: T) => T
  // showMessage?: boolean
  addTitle?: string
  editTitle?: string
  title?: string
}

export interface IDialogExpose {
  show: () => void
  close: () => void
}
