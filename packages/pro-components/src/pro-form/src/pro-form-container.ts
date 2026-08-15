import type { FormFieldError, FormMethodsType, FormModel } from './types/form'

export interface ProFormContainerOpenOptions<TModel extends FormModel> {
  id?: string | number
  values?: Partial<TModel>
  title?: string
}

export type ProFormFinish<TModel extends FormModel, TResult = unknown> = (
  values: TModel
) => Promise<TResult | false> | TResult | false

export type ProFormLoad<TModel extends FormModel> = (
  id: string | number
) => Promise<Partial<TModel>>

export interface ProFormContainerExpose<TModel extends FormModel, TResult = unknown> {
  getVisible: () => boolean
  getLoading: () => boolean
  getLoadingData: () => boolean
  getSubmitting: () => boolean
  getForm: () => FormMethodsType<TModel> | null
  getResult: () => TResult | undefined
  open: (options?: ProFormContainerOpenOptions<TModel>) => Promise<void>
  close: () => Promise<boolean>
  submit: () => Promise<boolean>
  reset: () => Promise<void>
}

export interface ProFormContainerBehavior<TModel extends FormModel, TResult = unknown> {
  initialValues?: TModel
  onFinish?: ProFormFinish<TModel, TResult>
  load?: ProFormLoad<TModel>
  mapError?: (error: unknown) => FormFieldError<TModel>[]
  beforeSubmit?: (form: FormMethodsType<TModel>) => boolean | Promise<boolean>
  closeOnSuccess?: boolean
  resetOnClose?: boolean
  preventCloseWhileSubmitting?: boolean
  warnWhenDirty?: boolean
  dirtyConfirmMessage?: string
  confirmDirtyClose?: (message: string) => boolean | Promise<boolean>
}
