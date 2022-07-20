/*
 * @Description:
 * @Autor: qsyj
 * @Date: 2022-07-19 11:50:25
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 09:17:26
 */

import { defineStore } from 'pinia'
import { useStorageHelper } from '@/hooks'
import { getThemeCluster, updateElementStyle } from '@/utils'

export interface LayoutType {
  // 是否折叠 菜单栏
  isCollapse: boolean

  themeColor: string
}

export interface AppState {
  isOpenSettig: boolean
  layoutConfig: LayoutType
}

export interface AppAction {
  collapseMenu: () => void
  toggleSettingDrawer: () => void
  //  映射为可选属性
  setLayoutConfig: (val: { [P in keyof LayoutType]?: LayoutType[P] }) => void
}

export type AppGetter = Record<string, never>

const appStoreKey = 'app'

export const useAppStore = defineStore<string, AppState, AppGetter, AppAction>(appStoreKey, {
  state() {
    return {
      // 是否打开设置
      isOpenSettig: false,
      // layout 配置
      layoutConfig: {
        // 是否折叠 菜单栏
        isCollapse: false,
        themeColor: '#409eff'
      }
    }
  },
  actions: {
    // 折叠菜单栏
    collapseMenu() {
      this.layoutConfig.isCollapse = !this.layoutConfig.isCollapse
      const { setLayoutCache } = useStorageHelper()

      setLayoutCache(this.layoutConfig)
    },
    // 设置抽屉开关
    toggleSettingDrawer() {
      this.isOpenSettig = !this.isOpenSettig
    },

    // 设置
    setLayoutConfig(val) {
      this.layoutConfig = { ...this.layoutConfig, ...val }
      updateElementStyle(getThemeCluster(this.layoutConfig.themeColor))

      const { setLayoutCache } = useStorageHelper()

      setLayoutCache(this.layoutConfig)
    }
  },
  getters: {}
})

export default useAppStore
