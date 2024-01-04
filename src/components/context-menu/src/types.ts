export interface ProContextMenuItem {
  command: string
  title: string
  disabled?: boolean
  icon?: string
  /** 是否在点击菜单是关闭 */
  closeOnClick?: boolean
  children?: ProContextMenuItem[]
  onClick?: () => void
}

export interface ContextMenuProvider {
  onClick: (command, menu) => void
}
