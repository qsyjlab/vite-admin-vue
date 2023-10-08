import { createContext, useContext } from '@/hooks/core/use-context'
import type { InjectionKey } from 'vue'

interface FormActionContext {
  submit: () => void
  reset: () => void
  toggleCollapse: () => void
}

const contextKey: InjectionKey<FormActionContext> = Symbol()

export function createFormActionContext(context: FormActionContext) {
  return createContext(context, contextKey, { native: true })
}

export function useFormActionContext() {
  return useContext(contextKey)
}
