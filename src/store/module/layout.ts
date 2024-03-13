import { defineStore } from 'pinia'
import type { ProjectLayoutConfig } from '@/layouts'
import { LayoutMode } from '@/layouts'
import { setLayoutCache } from '../local'

interface LayoutState {
  layoutConfig: ProjectLayoutConfig
  mixMenuLayoutConfig: {
    showChildren: boolean
  }
  isOpenSettig: boolean
}

interface LayoutAction {
  setLayoutConfig: (config: Partial<LayoutState['layoutConfig']>) => void
  toggleSettingDrawer: () => void
  setShowMixChildrenMenu: (val: boolean) => void
}

export type LayoutGetter = Record<string, never>

const LayoutStoreKey = 'layoutStoreKey'

export const useLayoutStore = defineStore<string, LayoutState, LayoutGetter, LayoutAction>(
  LayoutStoreKey,
  {
    state() {
      return {
        layoutConfig: {
          layoutMode: LayoutMode.Side,
          collapsed: false,
          asideWidth: 220,
          tabBarHeight: 30,
          headerHeight: 48,
          theme: 'light',
          themeColor: '#1677FF',
          splitMenu: true,
          footerHeight: 56,
          showTagPage: true,
          showFooter: true,
          showBreadCrumb: true,
          sideMixFixedMenu: false,
          sideMixShowChildren: false
        },
        mixMenuLayoutConfig: {
          showChildren: false
        },
        isOpenSettig: false
      }
    },
    actions: {
      setLayoutConfig(config) {
        this.layoutConfig = { ...this.layoutConfig, ...config }
        setLayoutCache(this.layoutConfig)
      },
      // 切换设置抽屉
      toggleSettingDrawer() {
        this.isOpenSettig = !this.isOpenSettig
      },
      // 设置混合菜单固定
      setShowMixChildrenMenu(val) {
        this.mixMenuLayoutConfig.showChildren = val
      }
    }
  }
)

export default useLayoutStore
