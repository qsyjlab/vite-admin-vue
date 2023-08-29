import { useLayoutStore } from '@/store'
import { storeToRefs } from 'pinia'

import { LayoutMode, ProjectLayoutConfig } from '@/layouts'

import { useElementCssVar } from './use-theme-color'

import { useDark, useToggle } from '@vueuse/core'

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
  // tabbar
  TAB_BAR_HEIGHT: 'tabBarHeight',
  // split menu
  SPLIT_MENU: 'splitMenu'
} as const

export function useLayoutConfigHandler() {
  const layoutStore = useLayoutStore()
  const { setElementCssVar, removeElementCssVar } = useElementCssVar()

  const { layoutConfig } = storeToRefs(layoutStore)

  const isDark = useDark({
    storageKey: 'LAYOUT_THEME',
    storage: localStorage
  })

  const toggleDark = useToggle(isDark)

  function handler(eventKey: EventKeys, value: any): Partial<ProjectLayoutConfig> | null {
    switch (eventKey) {
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
            splitMenu: undefined,
            layoutMode: value
          }
        return {
          layoutMode: value
        }
      }

      case LayoutConfigHandlerEnum.THEME_COLOR: {
        !isDark.value && setElementCssVar(value)
        return {
          themeColor: value
        }
      }
      case LayoutConfigHandlerEnum.LAYOUT_THEME: {
        if (value === 'dark' && !isDark.value) {
          toggleDark()

          removeElementCssVar()
        } else if (value === 'light' && isDark.value) {
          toggleDark()
          layoutConfig.value.themeColor && setElementCssVar(layoutConfig.value.themeColor)
        }

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

  const setLayoutConfig: SetLayoutConfig = (eventKey, value) => {
    const config = handler(eventKey, value)

    config && layoutStore.setLayoutConfig(config)
  }

  const initLayout = (config: ProjectLayoutConfig) => {
    layoutStore.setLayoutConfig(config)

    const themeColor = config.themeColor || layoutConfig.value.themeColor
    themeColor && setLayoutConfig(LayoutConfigHandlerEnum.THEME_COLOR, themeColor)

    const themeMode = config.theme || layoutConfig.value.theme
    setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_THEME, themeMode)
  }

  return {
    initLayout,
    layoutConfig,
    setLayoutConfig
  }
}
