import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { FormMethodsType, FormModel } from './types'

interface FormContext<TModel extends FormModel = FormModel> {
  formModel: Ref<TModel>
  submit: () => Promise<boolean>
  reset: () => void
  toggleCollapse: () => void
  getFieldValue: FormMethodsType['getFieldValue']
  setFieldValue: FormMethodsType['setFieldValue']
  setFieldVisibility: (key: string | number, visible: boolean) => void
  removeFieldVisibility: (key: string | number) => void
  getFieldError: (name: string | number | readonly (string | number)[]) => string
}

const contextKey: InjectionKey<FormContext> = Symbol('formContenxt')

export function createFormContext<TModel extends FormModel>(context: FormContext<TModel>) {
  provide(contextKey, context as FormContext)
  return context
}

export function useFormContext<TModel extends FormModel = FormModel>() {
  const context = inject(contextKey, undefined)
  if (!context) throw new Error('ProForm context is not available')
  return context as FormContext<TModel>
}
