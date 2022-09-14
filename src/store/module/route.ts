import { createWebHistoryRouter } from '@/router/helper'
import { defineStore } from 'pinia'

import type { RouteMeta, RouteRecordNormalized, RouteRecordRaw } from 'vue-router'

import { cloneDeep, omit } from 'lodash-es'

export interface MenuItem {
  name: string
  meta?: RouteMeta
  children?: MenuItem[]
}

export interface RouteState {
  menuList: MenuItem[]
  isFristEntry: boolean
  keepAliveCache: Set<string>
}

export interface RouteAction {
  initRoutes: (routes: MenuItem[]) => void
  addAlive: (names: string[]) => void
  buildRoutes: (asyncRoutes: RouteRecordRaw[]) => Promise<RouteRecordRaw[]>
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
        // 菜单栏数组
        menuList: [],
        // 是否第一次经过路由
        isFristEntry: false,
        // 缓存列表
        keepAliveCache: new Set()
      }
    },
    actions: {
      async buildRoutes(asyncRoutes) {
        const routes = asyncRoutes

        function isMultipleRoute(route: RouteRecordRaw): boolean {
          if (!route || !Reflect.has(route, 'children') || !route.children?.length) return false

          const child = route.children

          let isMultpile = false

          for (let i = 0; i < child.length; i++) {
            const c = child[i]
            if (c.children?.length) {
              isMultpile = true
              break
            }
          }

          return isMultpile
        }

        function upgradeRouteLevel(route: RouteRecordRaw) {
          const routerInstance = createWebHistoryRouter([route])

          const routes = routerInstance.getRoutes()

          addToChildren(routes, route.children || [], route)

          route.children = route.children?.map(item => omit(item, 'children')) as RouteRecordRaw[]
        }

        function addToChildren(
          routes: RouteRecordNormalized[],
          children: RouteRecordRaw[],
          routeRoot: RouteRecordRaw
        ) {
          for (let i = 0; i < children.length; i++) {
            const c = children[i]
            const route = routes.find(item => item.name === c.name)

            if (!route) continue

            routeRoot.children = routeRoot.children || []

            if (!routeRoot.children.find(item => item.name === route.name)) {
              routeRoot.children.push(route)
            }

            if (c.children?.length) {
              addToChildren(routes, c.children, routeRoot)
            }
          }
        }

        function flatMultiLevelRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
          const rs: RouteRecordRaw[] = cloneDeep(routes)

          for (let i = 0; i < rs.length; i++) {
            const r = rs[i]

            if (!isMultipleRoute(r)) {
              continue
            }
            upgradeRouteLevel(r)
          }

          return rs
        }

        return flatMultiLevelRoutes(routes)
      },

      // 初始化路由菜单
      initRoutes(routes) {
        this.menuList = routes

        this.isFristEntry = true
      },
      addAlive(names) {
        for (let i = 0; i < names.length; i++) {
          this.keepAliveCache.add(names[i])
        }
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
