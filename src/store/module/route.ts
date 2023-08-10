import { defineStore } from 'pinia'

import type { RouteMeta } from 'vue-router'

export interface MenuItem {
  name: string
  meta?: RouteMeta
  children?: MenuItem[]
}

export interface RouteState {
  isFristEntry: boolean
  keepAliveCache: Set<string>
}

export interface RouteAction {
  addAlive: (names: string) => void
  saveMenus: (menus: MenuItem[]) => void
}

export interface RouteGetters {
  [key: string]: any
  getAliveCache: (state: RouteState) => string[]
}

export const routeStoreKey = 'routeStoreKey'
export const useRouteStore = defineStore<string, RouteState, RouteGetters, RouteAction>(
  routeStoreKey,
  {
    state() {
      return {
        currentModule: '',
        // 菜单栏数组
        menuList: [],
        routeMapping: {},
        // 是否第一次经过路由
        isFristEntry: true,
        // 缓存列表
        keepAliveCache: new Set()
      }
    },
    actions: {
      addAlive(name) {
        this.keepAliveCache.add(name)
      },
      saveMenus(menus) {
        this.isFristEntry = false
      }
    },
    getters: {
      // 获取 keepAlive 缓存
      getAliveCache: (state: RouteState) => {
        return Array.from(state.keepAliveCache)
      }
    }
  }
)

export default useRouteStore
