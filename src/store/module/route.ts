import { defineStore } from 'pinia'
export interface RouteState {
  keepAliveCache: Set<string>
}

export interface RouteAction {
  addAlive: (names: string) => void
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
