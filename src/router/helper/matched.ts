import { RouteRecordRaw, createRouterMatcher, RouterMatcher } from 'vue-router'
import { routes } from '../routes'

/**
 * 使用 vue-router 内置的 createRouterMatcher ,传入扁平化之前 路由记录
 * 在拦截器中 拿到 to,from 通过 matcher.resolve 来拿到 原来的 matched 记录
 */
let matcher: RouterMatcher | null = null

export function createMatcher(asyncRoutes: RouteRecordRaw[]) {
  matcher = createRouterMatcher([...routes, ...asyncRoutes], {})
}

export function resolveMatched(...rest: Parameters<RouterMatcher['resolve']>) {
  try {
    return matcher?.resolve(...rest).matched || []
  } catch (error) {
    return []
  }
}
