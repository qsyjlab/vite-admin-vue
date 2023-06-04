import type { RouteRecordRaw } from 'vue-router'
import { transformRoutes as menuFilter, transformMenuModule } from '@/router/helper'

export type RouteModules = Record<
  string,
  {
    default: RouteRecordRaw | RouteRecordRaw[]
  }
>

const modules: RouteModules = import.meta.glob('../routes/modules/**/*.ts', { eager: true })

const asyncRoutes: any[] = []
for (const menu of loadRouterModules()) {
  asyncRoutes.push(transformMenuModule(menu))
}

// 加载路由模块
export function loadRouterModules() {
  const routeModuleList: RouteRecordRaw[] = []

  Object.keys(modules).forEach(key => {
    const m = modules[key].default

    const ml = Array.isArray(m) ? [...m] : [m]

    routeModuleList.push(...ml)
  })

  return routeModuleList
}

export function getAsyncMenus() {
  return menuFilter(asyncRoutes)
}

export function getMenus() {
  return getAsyncMenus()
}
