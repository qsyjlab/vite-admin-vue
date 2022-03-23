/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-29 10:51:21
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-23 21:40:23
 */
// import { storage } from '@plugins/methods'

import type { Module } from 'vuex'

import { getThemeCluster, updateElementStyle } from '@/utils'
import { useStorageHelper } from '@/hooks'

const appMoudle: Module<VStoreRoot.App.AppRootState, VStoreRoot.RootState> = {
  namespaced: true,
  state: {
    // 是否打开设置抽屉
    isOpenSettig: false,

    // layout 配置
    layoutConfig: {
      // 是否折叠 菜单栏
      isCollapse: false,
      themeColor: '#409eff'
    }
  },
  mutations: {
    // 折叠菜单栏
    collapseMenu(state) {
      state.layoutConfig.isCollapse = !state.layoutConfig.isCollapse
      const { setLayoutCache } = useStorageHelper()

      setLayoutCache(state.layoutConfig)
    },
    // 设置抽屉开关
    toggleSettingDrawer(state) {
      state.isOpenSettig = !state.isOpenSettig
    },

    // 设置
    setLayoutConfig(state, val) {
      state.layoutConfig = { ...state.layoutConfig, ...val }
      updateElementStyle(getThemeCluster(state.layoutConfig.themeColor))

      const { setLayoutCache } = useStorageHelper()

      setLayoutCache(state.layoutConfig)
    }
  },
  getters: {},
  actions: {}
}

export default appMoudle
