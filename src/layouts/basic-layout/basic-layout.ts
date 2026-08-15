import type { LayoutProps } from '../layout-package'
import type { LogoProps } from './components/logo'
import { LayoutMode } from './enum'

export type BasicLayoutProps = LayoutProps

export type LayoutModeMap = Record<LayoutMode, () => BasicLayoutProps>

export type LogoModeMap = Record<LayoutMode, () => LogoProps>
