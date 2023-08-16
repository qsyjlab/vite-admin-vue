import { defineStore, storeToRefs } from 'pinia'

import type { RouteRecordRaw } from 'vue-router'
import { asyncRoutes } from '@/router/routes/async'
import { flatRoutesLevel } from '@/router/helper/resolve'
import { router } from '@/router'
import useUserStore from './user'
import { filter } from '@/utils'

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
        const { permissions } = storeToRefs(useUserStore())

        let routes = []

        function routerFilter(route: RouteRecordRaw) {
          const name = route.name

          if (!name) return true
          return permissions.value.includes(name as string)
        }

        routes = filter(asyncRoutes, routerFilter, { id: 'name' })

        // TODO: 在这里拿到菜单

        return await flatRoutesLevel(routes)
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
