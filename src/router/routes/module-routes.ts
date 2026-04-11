import type { RouteRecordRaw } from 'vue-router'

export type RouteModules = Record<
  string,
  () => Promise<{
    default: RouteRecordRaw | RouteRecordRaw[]
  }>
>

/**
 * 收集异步加载路由放在这个地方防止外部引用出现循环引用问题
 */
const modules = import.meta.glob('./modules/**/*.ts') as unknown as RouteModules

let routeModulesCache: RouteRecordRaw[] | null = null

export async function loadRouteModules() {
  if (routeModulesCache) {
    return routeModulesCache
  }

  const routeModuleList: RouteRecordRaw[] = []
  const moduleKeys = Object.keys(modules).sort()

  for (const key of moduleKeys) {
    const moduleRoutes = (await modules[key]()).default
    const normalizedRoutes = Array.isArray(moduleRoutes) ? [...moduleRoutes] : [moduleRoutes]
    routeModuleList.push(...normalizedRoutes)
  }

  routeModulesCache = routeModuleList
  return routeModuleList
}
