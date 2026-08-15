export interface ProTabItem {
  /** 唯一标识 */
  key: string
  /** 标签文字 */
  label: string
  /** 图标 */
  icon?: string
  /** 是否可关闭 */
  closable?: boolean
  /** 是否固定（不可关闭、不可拖走） */
  affix?: boolean
}

export interface ProTabsProps {
  /** 标签列表 */
  tabs: ProTabItem[]
  /** 当前激活 key */
  modelValue: string | number
  /** 高度，默认 32px */
  height?: number
  /** 字体大小 */
  fontSize?: number
  /** 是否可拖拽排序 */
  draggable?: boolean
  /** 是否显示更多操作按钮 */
  showMoreAction?: boolean
}
