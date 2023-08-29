import { readonly } from 'vue'

export interface ProjectConfig {
  /** 是否显示设置按钮 */
  showSettingButton: boolean
  /** 是否显示页脚 */
  showFooter: boolean
  /** 是否显示标签栏 */
  showTagPage: boolean
  /** 是否显示面包屑导航 */
  showBreadCrumb: boolean
  /** 是否显示面包屑导航图标 */
  showBreadCrumbIcon: boolean
  /** 返回顶部 */
  showBackTop: boolean
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
  showSettingButton: true,
  showFooter: true,
  showTagPage: true,
  showBreadCrumb: true,
  showBreadCrumbIcon: true,
  showBackTop: true,
  openLeavePagePrompt: true,
  keepAliveCachePolicy: 'normal'
})

export default setting
