import { useLayoutStore } from '@/store'
import { storeToRefs } from 'pinia'

import type { ProjectLayoutConfig } from '@/layouts'

import { useElementCssVar } from './use-theme-color'

import { useDark, useToggle } from '@vueuse/core'

type SetLayoutConfig = (eventKey: EventKeys, value: any) => void
type EventKeys = typeof LayoutConfigHandlerEnum[keyof typeof LayoutConfigHandlerEnum]

// type LayoutConfigHandlerEnumKeys = keyof typeof LayoutConfigHandlerEnum

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
  TAB_BAR_HEIGHT: 'tabBarHeight'
} as const

export function useLayoutConfigHandler() {
  const layoutStore = useLayoutStore()
  const { setElementCssVar, removeElementCssVar } = useElementCssVar()

  const { layoutConfig } = storeToRefs(layoutStore)
  function handler(eventKey: EventKeys, value: any): ProjectLayoutConfig | null {
    switch (eventKey) {
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
        const isDark = useDark({
          storageKey: 'LAYOUT_THEME',
          storage: localStorage
        })

        const toggleDark = useToggle(isDark)
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
    config.themeColor && setLayoutConfig(LayoutConfigHandlerEnum.THEME_COLOR, config.themeColor)

    config.theme && setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_THEME, config.theme)
  }

  return {
    initLayout,
    layoutConfig,
    setLayoutConfig
  }
}
