import type { LayoutMode } from './enum'

export type ThemeMode = 'light' | 'dark'
// layout config
export interface ProjectLayoutConfig {
  layoutMode: LayoutMode
  showTagPage: boolean
  asideWidth: number
  collapsed: boolean
  showBreadCrumb: boolean
  headerHeight: number
  tabBarHeight: number
  themeColor: string
  theme: ThemeMode
  /** 顶部混合时可拆分菜单  */
  splitMenu: boolean
  footerHeight: number
  showFooter: boolean
  sideMixFixedMenu: boolean
}
