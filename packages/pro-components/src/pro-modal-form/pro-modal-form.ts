import type { DialogProps } from 'element-plus'
import type {
  FormModel,
  FormSchema,
  ProFormProps,
  ProFormContainerBehavior,
  ProFormContainerExpose
} from '../pro-form'

export type ProModalFormProps<TModel extends FormModel, TResult = unknown> = Partial<
  Omit<ProFormProps<TModel>, 'fields' | 'model'>
> &
  ProFormContainerBehavior<TModel, TResult> & {
    fields: FormSchema<TModel>[]
    dialogProps?: Partial<Omit<DialogProps, 'modelValue' | 'beforeClose'>>
    title?: string
    width?: string | number
    cancelText?: string
    confirmText?: string
    beforeClose?: () => boolean | Promise<boolean>
    preventCloseWhileSubmitting?: boolean
  }

export type ProModalFormExpose<
  TModel extends FormModel,
  TResult = unknown
> = ProFormContainerExpose<TModel, TResult>

export type ProModalFormInstance<TModel extends FormModel, TResult = unknown> = ProModalFormExpose<
  TModel,
  TResult
>
