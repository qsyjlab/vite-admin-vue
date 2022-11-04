import { useLayoutStore } from '@/store'
import { storeToRefs } from 'pinia'

import type { Ref } from 'vue'
import { ProjectLayoutConfig } from '@/layouts'

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
  HEADER_HEIGHT
}

export function useLayoutConfigHandler(): [Ref<ProjectLayoutConfig>, SetLayoutConfig] {
  const layoutStore = useLayoutStore()

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

      case LayoutConfigHandlerEnum.LAYOUT_THEME: {
        // setTheme(value)

        return null
      }

      default:
        return null
    }
  }

  const setLayoutConfig: SetLayoutConfig = (eventKey, value) => {
    const config = handler(eventKey, value)

    config && layoutStore.setLayoutConfig(config)
  }

  return [layoutConfig, setLayoutConfig]
}
