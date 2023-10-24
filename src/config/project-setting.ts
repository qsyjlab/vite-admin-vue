import { LayoutMode } from '@/layouts'
import { readonly } from 'vue'

export interface ProjectConfig {
  theme: 'light' | 'dark'
  themeColor: string
  defaultLayoutSetting: {
    layoutMode: LayoutMode
    /** header start */
    /** 是否显示面包屑导航 */
    showBreadCrumb: boolean
    /** 是否显示面包屑导航图标 */
    showBreadCrumbIcon: boolean
    /** 是否显示设置按钮 */
    showSettingButton: boolean
    /** 头部高度 */
    headerHeight: number
    /** header end */

    /** aside start */
    /** 菜单是否折叠 */
    asideMenuCollapsed: boolean
    /** 侧边栏宽度 */
    asideWidth: number
    /** aside end */

    /** tabbar start */
    /** 是否显示标签栏 */
    showTagPage: boolean
    /** tab page 宽度 */
    tabBarHeight: number
    /** tabbar end */

    splitMenu: boolean
    /** 返回顶部 */
    showBackTop: boolean
    /** 是否显示页脚 */
    showFooter: boolean
  }
  /**
   * 是否在切换路由导航的时候提示
   * TODO: 暂时未能实现
   */
  openLeavePagePrompt: boolean
  /**
   * never:不缓存
   * tab: 缓存当前 tab 中的项，且未忽略的项
   * normal: 正常缓存含有 name的组件
   */
  keepAliveCachePolicy: 'never' | 'tab' | 'normal'
}

const setting: ProjectConfig = readonly({
  themeColor: '#1677FF',
  theme: 'light',
  defaultLayoutSetting: {
    layoutMode: LayoutMode.Side,
    /** header start */
    showBreadCrumb: true,
    showBreadCrumbIcon: true,
    showSettingButton: true,
    headerHeight: 48,
    /** header end */

    /** aside start */
    asideMenuCollapsed: false,
    asideWidth: 220,

    /** aside end */

    /** tabbar start */

    /** 是否显示标签栏 */
    showTagPage: true,
    /** tab page 宽度 */
    tabBarHeight: 30,

    /** tabbar end */

    /** 是否分割菜单 进在 顶部 混合模式下生效 */
    splitMenu: true,
    /** 返回顶部 */
    showBackTop: true,
    /** 是否显示页脚 */
    showFooter: true
  },
  openLeavePagePrompt: true,
  keepAliveCachePolicy: 'normal'
})

export default setting
