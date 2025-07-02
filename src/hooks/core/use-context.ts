import {
  type InjectionKey,
  provide,
  inject,
  reactive,
  readonly as defineReadonly,
  type UnwrapRef
} from 'vue'

export interface CreateContextOptions {
  readonly?: boolean
  createProvider?: boolean
  native?: boolean
}

type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>
}

export function createContext<T extends object>(
  context: T,
  key: InjectionKey<T> = Symbol(),
  options: CreateContextOptions = {}
) {
  const { readonly = true, createProvider = false, native = false } = options

  const state = reactive<T>(context as any)
  const provideData = readonly ? defineReadonly(state) : state

  if (!createProvider) {
    if (native) {
      provide<any>(key, context)
    } else {
      provide<any>(key, provideData as any)
    }
  }

  return {
    state
  }
}

export function useContext<T>(key: InjectionKey<T>, native?: boolean): T

export function useContext<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any
): ShallowUnwrap<T> {
  return inject(key, defaultValue || {})
}
