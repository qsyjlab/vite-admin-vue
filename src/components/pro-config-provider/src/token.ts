import type { InjectionKey } from 'vue'
import type { ProConfigProviderProps } from './types'

export const proConfigProviderContextKey: InjectionKey<ProConfigProviderProps> = Symbol()
