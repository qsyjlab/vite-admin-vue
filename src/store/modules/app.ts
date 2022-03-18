/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-29 10:51:21
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-18 18:00:31
 */
// import { storage } from '@plugins/methods'

import type { Module } from 'vuex'

import { getThemeCluster } from '@/utils'

const appMoudle: Module<VStoreRoot.app.appRootState, VStoreRoot.rootState> = {
  namespaced: true,
  state: {
    keepAliveList: {},
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
    },
    // 设置抽屉开关
    toggleSettingDrawer(state) {
      state.isOpenSettig = !state.isOpenSettig
    },

    // 设置
    setLayoutConfig(state, val) {
      state.layoutConfig = { ...state.layoutConfig, ...val }

      const updateElementStyle = (colorList: string[]): void => {
        // document.documentElement is global
        const el = document.documentElement
        // set css var
        el.style.setProperty('--el-color-primary', colorList[0])
        el.style.setProperty('--el-button-bg-color', colorList[0])
        el.style.setProperty('--el-button-active-bg-color', colorList[10])
        el.style.setProperty('--el-button-active-border-color', colorList[10])
        el.style.setProperty('--el-color-primary-dark-2', colorList[1])
        el.style.setProperty('--el-color-primary-dark-1', colorList[1])

        for (let index = 1; index <= 9; index++) {
          el.style.setProperty(`--el-color-primary-light-${index}`, colorList[index])
        }
      }
      updateElementStyle(getThemeCluster(state.layoutConfig.themeColor))
    },
    addAlive(
      state,
      { page, name = 'default', alive }: { page: string; name: string; alive: string }
    ) {
      if (!state.keepAliveList[page]) {
        state.keepAliveList = {
          ...state.keepAliveList,
          [page]: { [name]: [alive] }
        }
        return
      }
      if (!Array.isArray(state.keepAliveList[page][name])) {
        state.keepAliveList[page] = {
          ...state.keepAliveList[page],
          [name]: [alive]
        }

        return
      }
      if (!state.keepAliveList[page][name].includes(alive)) {
        state.keepAliveList[page][name].push(alive)
      }

      console.log('keepAliveList', state.keepAliveList)
    }
  },
  getters: {
    getAlive:
      ({ keepAliveList }) =>
      (page: any, name = 'default'): string[] => {
        const list = keepAliveList[page]?.[name]
        return Array.isArray(list) ? list : []
      }
  },
  actions: {}
}

export default appMoudle
