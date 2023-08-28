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
  /** 是否在切换路由导航的时候提示 */
  openLeavePagePrompt: boolean
}

const setting: ProjectConfig = readonly({
  showSettingButton: true,
  showFooter: true,
  showTagPage: true,
  showBreadCrumb: true,
  showBreadCrumbIcon: true,
  showBackTop: true,
  openLeavePagePrompt: true
})

export default setting
