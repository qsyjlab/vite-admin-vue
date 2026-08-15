import { cloneDeep } from 'lodash-es'
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

/** 扁平路由 最大路由级别 2 级 */
export function flatRoutesLevel(asyncRoutes: RouteRecordRaw[]) {
  function resolveChildPath(parentPath: string, childPath: string) {
    if (!childPath) return parentPath
    if (childPath.startsWith('/')) return childPath
    if (!parentPath) return childPath

    return `${parentPath.replace(/\/$/, '')}/${childPath.replace(/^\//, '')}`
  }

  function flattenChildren(children: RouteRecordRaw[], parentPath = ''): RouteRecordRaw[] {
    const flattenedChildren: RouteRecordRaw[] = []

    children.forEach(child => {
      const clonedChild = cloneDeep(child)
      const fullPath = resolveChildPath(parentPath, clonedChild.path || '')
      const nestedChildren = clonedChild.children

      clonedChild.path = fullPath
      delete clonedChild.children
      flattenedChildren.push(clonedChild)

      if (nestedChildren?.length) {
        flattenedChildren.push(...flattenChildren(nestedChildren, fullPath))
      }
    })

    return flattenedChildren
  }

  return cloneDeep(asyncRoutes).map(route => {
    if (!route.children?.length) return route

    route.children = flattenChildren(route.children)
    return route
  })
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
