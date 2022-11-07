import type { LayoutMode } from './enum'

export type ThemeMode = 'light' | 'dark'
// layout config
export interface ProjectLayoutConfig {
  layoutMode?: LayoutMode
  asideWidth?: number
  collapsed?: boolean
  headerHeight?: number
  themeColor?: string
  theme?: ThemeMode
}
