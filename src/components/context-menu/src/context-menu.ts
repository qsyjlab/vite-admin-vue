import type { InjectionKey } from 'vue'
import type { ContextMenuProvider, ProContextMenuItem } from './types'

export const contextMenuKey: InjectionKey<ContextMenuProvider> = Symbol()

type Trigger = 'click' | 'contextmenu'

export interface ProContextMenuProps {
  menus: ProContextMenuItem[]
  closeOnClick?: boolean
  trigger?: Trigger[]
  itemHeight?: number
  fontSize?: number
}
