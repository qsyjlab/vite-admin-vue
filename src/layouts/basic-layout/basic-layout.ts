import type { LayoutHeaderProps, LayoutSideProps, LayoutTabProps } from '../layout-package'
import { LogoProps } from './components/logo'
import { LayoutMode } from './enum'

export type BasicLayoutProps = LayoutHeaderProps & LayoutSideProps & LayoutTabProps

export type LayoutModeMap = Record<LayoutMode, () => BasicLayoutProps>

export type LogoModeMap = Record<LayoutMode, () => LogoProps>
