import type { LayoutMode } from './enum'

export type ThemeMode = 'light' | 'dark'
export type NavigationTheme = 'light' | 'dark'
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
  /** 侧边导航主题，可独立于应用主题 */
  sidebarTheme: NavigationTheme
  /** 顶部导航主题，可独立于应用主题 */
  headerTheme: NavigationTheme
  /** 深色导航背景色 */
  darkMenuBackground: string
  /** 顶部混合时可拆分菜单  */
  splitMenu: boolean
  /** 分割菜单没有子菜单时仍显示侧栏 */
  showEmptySplitMenuSidebar: boolean
  footerHeight: number
  showFooter: boolean
  sideMixFixedMenu: boolean
}
