/*
 * @Description: router module
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:43:16
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-15 23:15:38
 * @FilePath: \vite-admin-vue\src\store\modules\route.ts
 */
import type { Module } from 'vuex'

import { transformRouteToList } from '@/utils'

const routeModule: Module<VStoreRoot.route.routeRootState, VStoreRoot.rootState> = {
  namespaced: true,
  state: {
    // 菜单栏数组
    menuList: [],
    // 是否第一次经过路由
    isFristEntry: false
  },
  mutations: {
    // 初始化路由菜单
    initRoutes(state, routes) {
      state.menuList = transformRouteToList(routes, [])

      console.log('state.menuList', state.menuList)
    }
  }
}

export default routeModule
