import type { LayoutMode } from './enum'

export type ThemeMode = 'light' | 'dark'
// layout config
export interface ProjectLayoutConfig {
  menuWidth?: number
  collapsed?: boolean
  layoutMode?: LayoutMode
  theme?: ThemeMode
  headerHeight?: number
}
