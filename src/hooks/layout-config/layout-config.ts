import { useLayoutStore } from '@/store'
import { storeToRefs } from 'pinia'

import type { ProjectLayoutConfig } from '@/layouts'

import { useElementCssVar } from './use-theme-color'

import { useDark, useToggle } from '@vueuse/core'

type SetLayoutConfig = (eventKey: LayoutConfigHandlerEnum, value: any) => void

export enum LayoutConfigHandlerEnum {
  // 布局模式
  LAYOUT_MODE,
  // 折叠菜单
  COLLAPSED,
  // 菜单宽度
  MENU_WIDTH,
  // 布局主体
  LAYOUT_THEME,
  // 头部高度
  HEADER_HEIGHT,
  // themeColor
  THEME_COLOR
}

export function useLayoutConfigHandler() {
  const layoutStore = useLayoutStore()
  const { setElementCssVar, removeElementCssVar } = useElementCssVar()

  const { layoutConfig } = storeToRefs(layoutStore)
  function handler(eventKey: LayoutConfigHandlerEnum, value: any): ProjectLayoutConfig | null {
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
        const isDark = useDark()
        const toggleDark = useToggle(isDark)
        toggleDark()

        if (isDark.value) {
          removeElementCssVar()
        }
        return {
          theme: value
        }
      }

      default:
        return null
    }
  }

  // type t = keyof ProjectLayoutConfig
  const setLayoutConfig: SetLayoutConfig = (eventKey, value) => {
    const config = handler(eventKey, value)

    config && layoutStore.setLayoutConfig(config)
  }

  const initLayout = (config: ProjectLayoutConfig) => {
    if (config.themeColor) {
      setLayoutConfig(LayoutConfigHandlerEnum.THEME_COLOR, config.themeColor)
    }
  }

  return {
    initLayout,
    layoutConfig,
    setLayoutConfig
  }
}
