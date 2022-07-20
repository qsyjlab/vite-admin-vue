/*
 * @Description: router module
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:43:16
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 11:30:59
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
  keepAliveList: {
    [key: string]: {
      [key: string]: Set<string>
    }
  }
}

export interface RouteAction {
  initRoutes: (routes: MenuItem[]) => void
  addAlive: (payload: { page: string; alive: string | undefined; name?: string }) => void
}

export interface RouteGetters {
  [key: string]: any
  getAlive: (state: RouteState) => (page: string, name?: string) => string[]
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
      addAlive(payload) {
        const { page, alive, name = 'default' } = payload

        if (!this?.keepAliveList[page]) {
          const value = new Set<string>()
          if (alive) {
            value.add(alive)
          }

          this.keepAliveList = {
            ...this.keepAliveList,
            [page]: { [name]: value }
          }
        } else if (this.keepAliveList[page][name].size !== 0 && alive) {
          this.keepAliveList[page][name].add(alive)
        }
      }
    },
    getters: {
      getAlive: (state: RouteState) => {
        return (page, name = 'default') => {
          const list = state.keepAliveList[page]?.[name]

          if (!list) return []
          return Array.from(list)
        }
      }
    }
  }
)

export default useRouteStore
