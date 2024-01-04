import { InjectionKey } from 'vue'
import { ContextMenuProvider } from './types'

export const contextMenuKey: InjectionKey<ContextMenuProvider> = Symbol()
