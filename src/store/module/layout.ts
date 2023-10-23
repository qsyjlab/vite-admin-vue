import { defineStore } from 'pinia'
import type { ProjectLayoutConfig } from '@/layouts'
import { LayoutMode } from '@/layouts'

interface LayoutState {
  layoutConfig: ProjectLayoutConfig
  mixMenuLayoutConfig: {
    fixedMenu: boolean
    showChildren: boolean
  }
  isOpenSettig: boolean
}

interface LayoutAction {
  setLayoutConfig: (config: Partial<LayoutState['layoutConfig']>) => void
  toggleSettingDrawer: () => void
  setMixMenuFixed: (val: boolean) => void
  setMixMenuLayoutConfig: (config: Partial<LayoutState['mixMenuLayoutConfig']>) => void
}

export type LayoutGetter = Record<string, never>

const LayoutStoreKey = 'Layout'

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
          splitMenu: true
        },
        mixMenuLayoutConfig: {
          fixedMenu: false,
          showChildren: false
        },
        isOpenSettig: false
      }
    },
    actions: {
      setLayoutConfig(config) {
        this.layoutConfig = { ...this.layoutConfig, ...config }
      },
      setMixMenuLayoutConfig(config) {
        this.mixMenuLayoutConfig = { ...this.mixMenuLayoutConfig, ...config }
      },
      // 切换设置抽屉
      toggleSettingDrawer() {
        this.isOpenSettig = !this.isOpenSettig
      },
      // 设置混合菜单固定
      setMixMenuFixed(val) {
        this.mixMenuLayoutConfig.fixedMenu = val
      }
    }
  }
)

export default useLayoutStore
