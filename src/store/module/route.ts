import { defineStore } from 'pinia'

import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import { asyncRoutes } from '@/router/routes'
import { buildRoutes } from '@/router/helper/resolve'
import { router } from '@/router'

export interface RouteState {
  keepAliveCache: Set<string>
}

export interface RouteAction {
  addAlive: (names: string) => void
  buildRoutes: () => Promise<RouteRecordRaw[]>
  addRouteBatch: (routes: RouteRecordRaw[]) => void
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
        keepAliveCache: new Set()
      }
    },
    actions: {
      addAlive(name) {
        this.keepAliveCache.add(name)
      },
      async buildRoutes() {
        return await buildRoutes(asyncRoutes)
      },
      addRouteBatch(routes) {
        routes.forEach(r => {
          router.addRoute(r)
        })
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
