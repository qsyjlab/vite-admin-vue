/*
 * @Description: router module
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:43:16
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 21:53:53
 * @FilePath: \vite-admin-vue\src\store\modules\route.ts
 */
import type { Module } from 'vuex'

import { transformRouteToList } from '@/utils'
import { MenuItem } from '@/types/store/moudles/route'

const routeModule: Module<VStoreRoot.Route.RouteRootState, VStoreRoot.RootState> = {
  namespaced: true,
  state: {
    // 菜单栏数组
    menuList: [],
    // 是否第一次经过路由
    isFristEntry: false,
    // 缓存列表
    keepAliveList: {}
  },
  mutations: {
    // 初始化路由菜单
    initRoutes(state, routes) {
      state.menuList = transformRouteToList<MenuItem>(routes, [])
      state.isFristEntry = true
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
    }
  },
  getters: {
    getAlive:
      ({ keepAliveList }) =>
      (page: any, name = 'default'): string[] => {
        const list = keepAliveList[page]?.[name]
        return Array.isArray(list) ? list : []
      }
  }
}

export default routeModule
