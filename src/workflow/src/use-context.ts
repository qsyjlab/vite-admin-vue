import { InjectionKey, provide, inject, UnwrapRef } from 'vue'

export interface CreateContextOptions {
  readonly?: boolean
  createProvider?: boolean
  native?: boolean
}

type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>
}

export function createContext<T extends object>(context: T, key: InjectionKey<T> = Symbol()) {
  provide<T>(key, context)

  return {
    state: context
  }
}

export function useContext<T>(key: InjectionKey<T>, native?: boolean): T

export function useContext<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any
): ShallowUnwrap<T> {
  return inject(key, defaultValue || {})
}
