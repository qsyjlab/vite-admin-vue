import { storeToRefs } from 'pinia'
import { useDark } from '@vueuse/core'
import { useLayoutStore } from '@/store'
import { LayoutMode, ProjectLayoutConfig } from '@/layouts'
import projectSetting, { ProjectConfig } from '@/config/project-setting'

import { useElementCssVar } from './use-theme-color'
import { cloneDeep } from 'lodash-es'
import { computed, unref } from 'vue'

type SetLayoutConfig = (eventKey: EventKeys, value: any) => void
type EventKeys = (typeof LayoutConfigHandlerEnum)[keyof typeof LayoutConfigHandlerEnum]

export const LayoutConfigHandlerEnum = {
  // 布局模式
  LAYOUT_MODE: 'layoutMode',
  // 折叠菜单
  COLLAPSED: 'collapsed',
  // 菜单宽度
  MENU_WIDTH: 'asideWidth',
  // 布局主体
  LAYOUT_THEME: 'theme',
  // 头部高度
  HEADER_HEIGHT: 'headerHeight',
  // themeColor
  THEME_COLOR: 'themeColor',
  // 标签页签显示
  SHOW_TAB_PAGE: 'showTabPage',
  // 显示页脚
  SHOW_FOOTER: 'showFooter',
  // 显示面包屑导航
  SHOW_BREAD_CRUMB: 'showBreadCrumb',
  // tabbar
  TAB_BAR_HEIGHT: 'tabBarHeight',
  // split menu
  SPLIT_MENU: 'splitMenu'
} as const

const isDark = useDark({
  storageKey: 'LAYOUT_THEME',
  storage: localStorage
})

export function useLayoutConfigHandler() {
  const layoutStore = useLayoutStore()
  const { setElementCssVar, removeElementCssVar } = useElementCssVar()

  const { layoutConfig } = storeToRefs(layoutStore)

  const setLayoutConfig: SetLayoutConfig = (eventKey, value) => {
    const config = handler(eventKey, value)

    config && layoutStore.setLayoutConfig(config)
  }

  const initLayout = (config: Partial<ProjectLayoutConfig>) => {
    layoutStore.setLayoutConfig(config)

    const themeColor = config.themeColor || layoutConfig.value.themeColor
    themeColor && setLayoutConfig(LayoutConfigHandlerEnum.THEME_COLOR, themeColor)

    const themeMode = config.theme || layoutConfig.value.theme
    setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_THEME, themeMode)

    setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_MODE, layoutConfig.value.layoutMode)
  }

  function handler(eventKey: EventKeys, value: any): Partial<ProjectLayoutConfig> | null {
    switch (eventKey) {
      case LayoutConfigHandlerEnum.SHOW_BREAD_CRUMB: {
        return {
          showBreadCrumb: value
        }
      }
      case LayoutConfigHandlerEnum.SHOW_FOOTER: {
        return {
          showFooter: value
        }
      }
      case LayoutConfigHandlerEnum.SHOW_TAB_PAGE: {
        return {
          showTagPage: value
        }
      }
      case LayoutConfigHandlerEnum.SPLIT_MENU: {
        return {
          splitMenu: value
        }
      }
      case LayoutConfigHandlerEnum.COLLAPSED: {
        return {
          collapsed: value
        }
      }
      case LayoutConfigHandlerEnum.MENU_WIDTH: {
        return {
          asideWidth: value
        }
      }
      case LayoutConfigHandlerEnum.HEADER_HEIGHT: {
        return {
          headerHeight: value
        }
      }

      case LayoutConfigHandlerEnum.LAYOUT_MODE: {
        if (value !== LayoutMode.TopMix)
          return {
            splitMenu: false,
            layoutMode: value
          }
        return {
          layoutMode: value
        }
      }

      case LayoutConfigHandlerEnum.THEME_COLOR: {
        setElementCssVar(value)
        return {
          themeColor: value
        }
      }
      case LayoutConfigHandlerEnum.LAYOUT_THEME: {
        if (value === 'dark') {
          isDark.value = true

          removeElementCssVar()
        } else if (value === 'light') {
          isDark.value = false
        }

        layoutConfig.value.themeColor && setElementCssVar(layoutConfig.value.themeColor)

        return {
          theme: value
        }
      }

      case LayoutConfigHandlerEnum.TAB_BAR_HEIGHT: {
        return {
          tabBarHeight: value
        }
      }

      default:
        return null
    }
  }

  function getProjectSetting() {
    const projectSettingCloned = cloneDeep(projectSetting) as ProjectConfig

    const _layoutConfig = unref(layoutConfig)

    const defaultLayoutSetting = projectSettingCloned.defaultLayoutSetting
    projectSettingCloned.theme = layoutConfig.value.theme
    projectSettingCloned.themeColor = _layoutConfig.themeColor
    defaultLayoutSetting.asideMenuCollapsed = _layoutConfig.collapsed
    defaultLayoutSetting.tabBarHeight = _layoutConfig.tabBarHeight
    defaultLayoutSetting.headerHeight = _layoutConfig.headerHeight
    defaultLayoutSetting.footerHeight = _layoutConfig.footerHeight
    defaultLayoutSetting.splitMenu = _layoutConfig.splitMenu
    defaultLayoutSetting.sideMixFixedMenu = _layoutConfig.sideMixFixedMenu
    defaultLayoutSetting.showBreadCrumb = _layoutConfig.showBreadCrumb
    defaultLayoutSetting.showFooter = _layoutConfig.showFooter
    defaultLayoutSetting.showTagPage = _layoutConfig.showTagPage

    return projectSettingCloned
  }

  function resetLayoutConfig() {
    const defaultLayoutSetting = projectSetting.defaultLayoutSetting

    layoutStore.setShowMixChildrenMenu(false)
    layoutStore.setLayoutConfig({
      layoutMode: defaultLayoutSetting.layoutMode,
      collapsed: defaultLayoutSetting.asideMenuCollapsed,
      asideWidth: defaultLayoutSetting.asideWidth,
      tabBarHeight: defaultLayoutSetting.tabBarHeight,
      headerHeight: defaultLayoutSetting.headerHeight,
      theme: projectSetting.theme,
      themeColor: projectSetting.themeColor,
      splitMenu: defaultLayoutSetting.splitMenu,
      footerHeight: defaultLayoutSetting.footerHeight,
      showBreadCrumb: defaultLayoutSetting.showBreadCrumb,
      showFooter: defaultLayoutSetting.showFooter,
      showTagPage: defaultLayoutSetting.showTagPage,
      sideMixFixedMenu: defaultLayoutSetting.sideMixFixedMenu
    })
  }
  return {
    initLayout,
    layoutConfig: computed(() => layoutConfig.value),
    setLayoutConfig,
    getProjectSetting,
    resetLayoutConfig
  }
}
