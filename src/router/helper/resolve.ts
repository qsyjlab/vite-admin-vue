import { cloneDeep, omit } from 'lodash-es'
import { createRouter, createWebHistory, RouteMeta } from 'vue-router'

import type { RouteRecordNormalized } from 'vue-router'

import { RouteRecordRaw, RouterOptions } from 'vue-router'

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

/** 扁平路由 最大路由级别 2 级 */
export async function flatRoutesLevel(asyncRoutes: RouteRecordRaw[]) {
  const routes = transformRoutes(asyncRoutes)

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
}

// 路径处理
function joinParentPath(menus: any[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index]
    // https://next.router.vuejs.org/guide/essentials/nested-routes.html
    // Note that nested paths that start with / will be treated as a root path.
    // 请注意，以 / 开头的嵌套路径将被视为根路径。
    // This allows you to leverage the component nesting without having to use a nested URL.
    // 这允许你利用组件嵌套，而无需使用嵌套 URL。
    if (!menu.path.startsWith('/')) {
      // path doesn't start with /, nor is it a url, join parent path
      // 路径不以 / 开头，也不是 url，加入父路径
      menu.path = `${parentPath}/${menu.path}`
    }
    if (menu?.children?.length) {
      joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path)
    }
  }
}

// Parsing the menu module
export function transformMenuModule(module: any): any {
  const menuList = [module]

  joinParentPath(menuList)
  return menuList[0]
}
// 根据路由源信息转换
export function transformRoutes(routes: RouteRecordRaw[], treeMap?: RouteRecordRaw[]) {
  if (routes && routes?.length === 0) return []

  return routes
    .reduce((acc, cur) => {
      acc.push({
        ...cur,
        name: cur.name as string,
        path: cur.path,
        meta: cur.meta,
        children: transformRoutes(cur.children || [], [])
      })
      return acc
    }, treeMap || [])
    .reverse()
    .sort((last, next) => (last.meta?.order || 0) - (next.meta?.order || 0))
}
