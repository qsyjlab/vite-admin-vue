import type { FormMethodsType, FormModel, FormSchema, ProFormProps } from '../pro-form'

export interface ProStepsFormStep<TModel extends FormModel> {
  key: string | number
  title: string
  description?: string
  fields: FormSchema<TModel>[]
  formProps?: Partial<Omit<ProFormProps<TModel>, 'fields' | 'model'>>
  beforeNext?: (values: TModel) => boolean | Promise<boolean>
}

export interface ProStepsFormProps<TModel extends FormModel, TResult = unknown> {
  steps: ProStepsFormStep<TModel>[]
  initialValues?: TModel
  onFinish?: (values: TModel) => TResult | false | Promise<TResult | false>
  previousText?: string
  nextText?: string
  submitText?: string
}

export interface ProStepsFormExpose<TModel extends FormModel, TResult = unknown> {
  getCurrent: () => number
  getLoading: () => boolean
  getValues: () => TModel
  getForm: () => FormMethodsType<TModel> | null
  getResult: () => TResult | undefined
  next: () => Promise<boolean>
  previous: () => void
  goTo: (index: number) => Promise<boolean>
  submit: () => Promise<boolean>
  reset: () => Promise<void>
}

export type ProStepsFormInstance<TModel extends FormModel, TResult = unknown> = ProStepsFormExpose<
  TModel,
  TResult
>
