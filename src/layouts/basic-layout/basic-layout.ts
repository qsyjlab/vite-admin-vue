import type { LayoutHeaderProps, LayoutSideProps } from '../layout-package'
import { LogoProps } from './components/logo'
import { LayoutMode } from './enum'

export type BasicLayoutProps = LayoutHeaderProps & LayoutSideProps

export type LayoutModeMap = Record<LayoutMode, () => BasicLayoutProps>

export type LogoModeMap = Record<LayoutMode, () => LogoProps>
