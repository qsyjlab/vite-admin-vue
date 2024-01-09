// 页脚
export interface LayoutFooterProps {
  /** 开启fixed布局 */
  fixed?: boolean
  /** fixed布局的层级 */
  zIndex?: number
  /** 最小宽度 */
  minWidth?: number
  /** 高度 */
  height?: number
  /** 左侧内边距 */
  paddingLeft?: number
  /** 动画过渡时间 */
  transitionDuration?: number
  /** 动画过渡时间 */
  transitionTimingFunction?: string
}

// header
export interface LayoutHeaderProps {
  /** 开启fixed布局 */
  fixed?: boolean
  /** fixed布局的层级 */
  zIndex?: number
  /** 最小宽度 */
  minWidth?: number
  /** 高度 */
  height?: number
  /** 左侧内边距 */
  paddingLeft?: number
  /** 动画过渡时间 */
  transitionDuration?: number
  /** 动画过渡时间 */
  transitionTimingFunction?: string
}

// main
export interface LayoutMainProps {
  /** 顶部内边距 */
  paddingTop?: number
  /** 底部内边距 */
  paddingBottom?: number
  /** 左侧内边距 */
  paddingLeft?: number
  /** 动画过渡时间 */
  transitionDuration?: number
  /** 动画过渡时间 */
  transitionTimingFunction?: string
}

// sidebar
export interface LayoutSideBarProps {
  /** fixed布局的层级 */
  zIndex?: number
  /** 宽度 */
  width?: number
  /** 顶部内边距 */
  paddingTop?: number
  /** 动画过渡时间 */
  transitionDuration?: number
  /** 动画过渡时间 */
  transitionTimingFunction?: string
}

// tabs
export interface LayoutTabsProps {
  /** 开启fixed布局 */
  fixed?: boolean
  /** fixed布局的top距离 */
  top?: number
  /** fixed布局的层级 */
  zIndex?: number
  /** 最小宽度 */
  minWidth?: number
  /** 高度 */
  height?: number
  /** 左侧内边距 */
  paddingLeft?: number
  /** 动画过渡时间 */
  transitionDuration?: number
  /** 动画过渡时间 */
  transitionTimingFunction?: string
}

export type LayoutProps = {
  asideWidth?: LayoutSideBarProps['width']
  asidePaddingTop?: LayoutSideBarProps['paddingTop']
  headerHeight?: LayoutHeaderProps['height']
  headerPaddingLeft?: LayoutHeaderProps['paddingLeft']
  headerZIndex?: LayoutHeaderProps['zIndex']
  tabHeight: LayoutTabsProps['height']
  footerHeight?: LayoutFooterProps['height']
  config?: {
    header: boolean
    tab: boolean
    aside: boolean
    footer: boolean
    main: boolean
  }
}
