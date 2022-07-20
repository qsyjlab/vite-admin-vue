/*
 * @Description: router module
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:43:16
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 09:18:25
 * @FilePath: \vite-admin-vue\src\store\modules\route.ts
 */

// import { transformRouteToList } from '@/utils'
import { defineStore } from 'pinia'

import type { RouteMeta } from 'vue-router'

export interface MenuItem {
  name: string
  meta?: RouteMeta
  children?: MenuItem[]
}

export interface RouteState {
  menuList: MenuItem[]
  isFristEntry: boolean
  keepAliveList: any
}

export interface RouteAction {
  initRoutes: (routes: MenuItem[]) => void
  addAlive: () => void
}

export interface RouteGetters {
  [key: string]: any
  getAlive: (state: RouteState) => (page: string, name: string) => string[]
}

export const routeStoreKey = 'routeStoreKey'
export const useRouteStore = defineStore<string, RouteState, RouteGetters, RouteAction>(
  routeStoreKey,
  {
    state() {
      return {
        // 菜单栏数组
        menuList: [],
        // 是否第一次经过路由
        isFristEntry: false,
        // 缓存列表
        keepAliveList: {}
      }
    },
    actions: {
      // 初始化路由菜单
      initRoutes(routes) {
        this.menuList = routes

        this.isFristEntry = true
      },
      addAlive() {
        // if (!this.keepAliveList[page]) {
        //   this.keepAliveList = {
        //     ...this.keepAliveList,
        //     [page]: { [name]: [alive] }
        //   }
        //   return
        // }
        // if (!Array.isArray(this.keepAliveList[page][name])) {
        //   this.keepAliveList[page] = {
        //     ...this.keepAliveList[page],
        //     [name]: [alive]
        //   }
        //   return
        // }
        // if (!this.keepAliveList[page][name].includes(alive)) {
        //   this.keepAliveList[page][name].push(alive)
        // }
      }
    },
    getters: {
      getAlive: (state: RouteState) => {
        return (page, name = 'default') => {
          const list = state.keepAliveList[page]?.[name] as string[]
          return Array.isArray(list) ? list : []
        }
      }
    }
  }
)

export default useRouteStore
