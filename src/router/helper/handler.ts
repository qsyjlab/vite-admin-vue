import { cloneDeep } from 'lodash-es'
import type { RouteRecordRaw } from 'vue-router'
import { treeMap, pipe } from '@/utils'
import { flatRoutesLevel, joinParentPath } from './resolve'
import type { Menu } from '../types'
import { setComponentName } from './component-name'

function normalizeRouteMenuMeta(routes: RouteRecordRaw[]) {
  return routes.map(route => {
    const menuMeta = route.meta?.menu || {}
    const nextMeta = {
      ...(route.meta || {}),
      title: menuMeta.title ?? route.meta?.title,
      icon: menuMeta.icon ?? route.meta?.icon,
      order: menuMeta.order ?? route.meta?.order,
      hideInMenu: menuMeta.hidden ?? route.meta?.hideInMenu,
      hideChildrenInMenu: menuMeta.hideChildrenInMenu ?? route.meta?.hideChildrenInMenu
    }

    const nextRoute: RouteRecordRaw = {
      ...route,
      meta: nextMeta
    }

    if (nextRoute.children?.length) {
      nextRoute.children = normalizeRouteMenuMeta(nextRoute.children)
    }

    return nextRoute
  })
}

// 将路由转换成菜单
export function generateRoutesToMenusHandler(routeModList: RouteRecordRaw[]): Menu[] {
  const clonedRoutes = normalizeRouteMenuMeta(cloneDeep(routeModList))

  // 处理菜单过滤项
  function menusFilter(items: RouteRecordRaw[]) {
    return items.filter(item => {
      const show = !item.meta?.hideInMenu
      if (show && item.children) {
        item.children = menusFilter(item.children)
      }
      return show
    })
  }

  // 处理菜单排序
  function routeMenusSort(routes: RouteRecordRaw[]) {
    const sorted = routes.sort((prev, next) => {
      return (
        (prev.meta?.order ?? Number.POSITIVE_INFINITY) -
        (next.meta?.order ?? Number.POSITIVE_INFINITY)
      )
    })

    sorted.forEach(route => {
      if (route.children?.length) {
        route.children = routeMenusSort(route.children)
      }
    })

    return sorted
  }

  // 单层级按钮层级提升
  function promoteSingleChild(menus: RouteRecordRaw[]): RouteRecordRaw[] {
    return menus.map(item => {
      let _temp: RouteRecordRaw = { ...item }
      const children = item.children
      if (children && children.length) {
        _temp.children = promoteSingleChild(children || [])
        const menuMeta = (_temp.meta?.menu || {}) as {
          promoteSingleChild?: boolean
          keepParent?: boolean
        }
        const shouldPromote =
          _temp.children?.length === 1 &&
          menuMeta.keepParent !== true &&
          (menuMeta.promoteSingleChild === true || _temp.meta?.hideChildrenInMenu === true)

        if (shouldPromote)
          _temp = {
            ..._temp.children[0],
            meta: {
              ...(_temp.meta || {}),
              ...(_temp.children[0].meta || {}),
              order: _temp.children[0].meta?.order ?? _temp.meta?.order
            }
          }
      }
      return _temp
    })
  }

  // 提取指定结构
  function getMenuStructure(routes: RouteRecordRaw[]): Menu[] {
    return treeMap(routes, {
      conversion: (node: RouteRecordRaw) => {
        const { name } = node

        return {
          meta: node.meta,
          name: name,
          path: node.path
        }
      }
    }) as Menu[]
  }

  return getMenuStructure(pipe(promoteSingleChild, menusFilter, routeMenusSort)(clonedRoutes))
}

// 路由转换
export function routeConversionHandler(routes: RouteRecordRaw[]) {
  function setRouteRedirect(routes: RouteRecordRaw[]) {
    routes.forEach(route => {
      if (route.children) {
        if (!route.redirect) {
          route.redirect = {
            path: route.children[0]?.path
          }
        }
        setRouteRedirect(route.children)
      }
    })

    return routes
  }
  return pipe(setComponentName, flatRoutesLevel, joinParentPath, setRouteRedirect)(routes)
}
