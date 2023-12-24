import { cloneDeep, omit } from 'lodash-es'
import { createRouter, createWebHistory } from 'vue-router'
import { treeMap } from '@/utils'
import type { RouteRecordNormalized, RouteRecordRaw, RouterOptions } from 'vue-router'
import type { Menu } from '../types'

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

// 将路由转换成菜单
export function transformRouteToMenu(routeModList: RouteRecordRaw[]) {
  const cloneRouteModList = promoteSingleChild(cloneDeep(routeModList))

  function promoteSingleChild(menus: RouteRecordRaw[]): RouteRecordRaw[] {
    return menus.map(item => {
      let _temp: RouteRecordRaw = { ...item }
      const children = item.children
      if (children && children.length) {
        _temp.children = promoteSingleChild(children || [])
        if (_temp.children?.length === 1 && _temp.meta?.hideChildrenInMenu !== false)
          _temp = {
            ..._temp.children[0],
            meta: {
              ..._temp.children[0].meta,
              order: _temp.meta.order ?? _temp.children[0].meta?.order
            }
          }
      }
      return _temp
    })
  }

  // 提取树指定结构
  const list = treeMap(cloneRouteModList, {
    conversion: (node: RouteRecordRaw) => {
      const { name } = node

      return {
        meta: node.meta,
        name: name,
        path: node.path
      }
    }
  })

  // 路径处理
  joinParentPath(list)
  return cloneDeep(list)
}

// 处理菜单排序
export function routeMenusSort(menus: Menu[]) {
  return menus.sort((prev, next) => {
    return (
      (prev.meta?.order || Number.POSITIVE_INFINITY) -
      (next.meta?.order || Number.POSITIVE_INFINITY)
    )
  })
}
