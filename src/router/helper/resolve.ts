import { cloneDeep, omit } from 'lodash-es'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordNormalized, RouteRecordRaw, RouterOptions } from 'vue-router'

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
export function flatRoutesLevel(asyncRoutes: RouteRecordRaw[]) {
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
}

// 路径处理
export function joinParentPath(menus: any[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index]
    if (!menu.path.startsWith('/')) {
      menu.path = `${parentPath}/${menu.path}`
    }
    if (menu?.children?.length) {
      joinParentPath(menu.children, menu.path)
    }
  }

  return menus
}
