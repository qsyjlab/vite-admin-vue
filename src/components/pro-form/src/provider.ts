import { createContext, useContext } from '@/hooks/core/use-context'
import type { InjectionKey, Ref } from 'vue'
import type { FormMethodsType } from './types'

interface FormContext {
  formModel: Ref<Record<string, any>>
  submit: () => void
  reset: () => void
  toggleCollapse: () => void
  getFieldValue: FormMethodsType['getFieldValue']
  setFieldValue: FormMethodsType['setFieldValue']
}

const contextKey: InjectionKey<FormContext> = Symbol('formContenxt')

export function createFormContext(context: FormContext) {
  return createContext(context, contextKey, { native: true })
}

export function useFormContext() {
  return useContext(contextKey)
}
