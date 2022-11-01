import { defineStore } from 'pinia'
import { LayoutMode, ProjectLayoutConfig } from '@/layouts'

interface LayoutState {
  layoutConfig: ProjectLayoutConfig
  isOpenSettig: boolean
}

interface LayoutAction {
  setLayoutConfig: (config: LayoutState['layoutConfig']) => void
  toggleSettingDrawer: () => void
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
          menuWidth: 220,
          headerHeight: 48,
          theme: 'light'
        },
        isOpenSettig: false
      }
    },
    actions: {
      setLayoutConfig(config) {
        this.layoutConfig = { ...this.layoutConfig, ...config }
      },
      toggleSettingDrawer() {
        this.isOpenSettig = !this.isOpenSettig
      }
    }
  }
)

export default useLayoutStore
