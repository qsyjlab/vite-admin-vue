import type { VNode } from 'vue'

export interface ProContextMenuItem {
  command: string
  title: string
  disabled?: boolean
  icon?: string | (() => VNode)
  /** 是否在点击菜单是关闭 */
  closeOnClick?: boolean
  children?: ProContextMenuItem[]
  onClick?: () => void
}

export interface ContextMenuProvider {
  onClick: (command, menu) => void
  itemHeight: number
  fontSize: number
}
