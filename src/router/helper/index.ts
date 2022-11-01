import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw, RouterOptions } from 'vue-router'

export function createWebHistoryRouter(
  routes: RouteRecordRaw[],
  options?: Omit<RouterOptions, 'routes' | 'history'>
) {
  return createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL),
    ...options
  })
}

export type RouteModules = Record<
  string,
  {
    default: RouteRecordRaw | RouteRecordRaw[]
  }
>

// 加载路由模块
export function loadRouterModules() {
  const modules: RouteModules = import.meta.glob('../routes/**/*.ts', { eager: true })
  const routeModuleList: RouteRecordRaw[] = []

  Object.keys(modules).forEach(key => {
    const m = modules[key].default

    const ml = Array.isArray(m) ? [...m] : [m]

    routeModuleList.push(...ml)
  })

  return routeModuleList
}
