import { RouteRecordRaw } from 'vue-router'
export type RouteModules = Record<
  string,
  {
    default: RouteRecordRaw | RouteRecordRaw[]
  }
>

/**
 * 收集异步加载路由放在这个地方防止外部引用 出现循环引用问题
 */

const modules: RouteModules = import.meta.glob('./modules/**/*.ts', { eager: true })

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

export const asyncRoutes = loadRouterModules()
