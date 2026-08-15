import type { DrawerProps } from 'element-plus'
import type {
  FormModel,
  FormSchema,
  ProFormProps,
  ProFormContainerBehavior,
  ProFormContainerExpose
} from '../pro-form'

export type ProDrawerFormProps<TModel extends FormModel, TResult = unknown> = Partial<
  Omit<ProFormProps<TModel>, 'fields' | 'model'>
> &
  ProFormContainerBehavior<TModel, TResult> & {
    fields: FormSchema<TModel>[]
    drawerProps?: Partial<Omit<DrawerProps, 'modelValue' | 'beforeClose'>>
    title?: string
    drawerSize?: string | number
    cancelText?: string
    confirmText?: string
    beforeClose?: () => boolean | Promise<boolean>
    preventCloseWhileSubmitting?: boolean
  }

export type ProDrawerFormExpose<
  TModel extends FormModel,
  TResult = unknown
> = ProFormContainerExpose<TModel, TResult>

export type ProDrawerFormInstance<
  TModel extends FormModel,
  TResult = unknown
> = ProDrawerFormExpose<TModel, TResult>
