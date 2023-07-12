import type { RouteTreeRelation } from '@/router'
import { defineStore } from 'pinia'

import type { RouteMeta, RouteRecordName } from 'vue-router'

export interface MenuItem {
  name: string
  meta?: RouteMeta
  children?: MenuItem[]
}

export interface RouteState {
  menuList: MenuItem[]
  routeMapping: Record<
    string,
    // TODO: 添加限制类型
    { isFlat: boolean; originRoutesRelation: Record<string, RouteTreeRelation>; menus: any[] }
  >
  isFristEntry: boolean
  keepAliveCache: Set<string>
}

export interface RouteAction {
  addAlive: (names: string) => void
  saveMenus: (menus: MenuItem[]) => void
  // TODO: 优化类型
  saveRoutesRelation: (
    moduleName: string,
    parameters: {
      relation: Record<string, RouteTreeRelation>
      menus: any[]
    }
  ) => void
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

        this.menuList = menus
      },

      // 保存拍平后的路由状态
      saveRoutesRelation(moduleName, parameters) {
        const module = this.routeMapping[moduleName]
        // 如果已经拍平了 跳过
        if (module && module.isFlat) return

        const { menus, relation: originRoutesRelation } = parameters

        this.routeMapping[moduleName] = {
          originRoutesRelation,
          menus,
          isFlat: true
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
