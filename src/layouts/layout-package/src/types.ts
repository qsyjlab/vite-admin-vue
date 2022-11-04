export type LayoutProps = LayoutSideProps & LayoutHeaderProps & LayoutTabProps

export interface LayoutSideProps {
  asideWidth?: number
  asideHeight?: number | string
  asidePaddingTop?: number
  asideTop?: number
}

export interface LayoutHeaderProps {
  headerHeight?: number
  headerPaddingLeft?: number
  headerZIndex?: number
}
export interface LayoutTabProps {
  tabHeight?: number
}

export interface AsideProps {
  zIndex?: number
  width?: number
  paddingTop?: number
  transitionDuration?: number
  transitionTimingFunction?: string
}

export interface MainProps {
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  transitionDuration?: number
  transitionTimingFunction?: string
}
