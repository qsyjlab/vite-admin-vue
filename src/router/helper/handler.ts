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

  // 单子路由默认提升：单路由情况下无需再包一层父路由
  // 仅当显式设置 keepParent: true 时才保留父级
  function promoteSingleChild(menus: RouteRecordRaw[]): RouteRecordRaw[] {
    return menus.map(item => {
      let _temp: RouteRecordRaw = { ...item }
      const children = item.children
      if (children && children.length) {
        _temp.children = promoteSingleChild(children || [])
        const menuMeta = (_temp.meta?.menu || {}) as {
          keepParent?: boolean
        }
        // 仅统计菜单中可见的子路由（hideInMenu: true 的子路由不计入）
        // 这样 TabPage 下的 detail/:id（hideInMenu: true）不会触发提升
        const visibleChildren = (_temp.children || []).filter(child => !child.meta?.hideInMenu)
        const shouldPromote = visibleChildren.length === 1 && menuMeta.keepParent !== true

        if (shouldPromote) {
          // 直接用子路由自身，不继承父级 meta
          _temp = { ...visibleChildren[0] }
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
        // 仅当存在未带动态参数的子路由时才自动设置 redirect，避免 "Missing required param" 错误
        if (!route.redirect) {
          const firstStaticChild = route.children.find(
            child => typeof child.path === 'string' && !child.path.includes(':')
          )
          if (firstStaticChild) {
            route.redirect = {
              path: firstStaticChild.path
            }
          }
        }
        setRouteRedirect(route.children)
      }
    })

    return routes
  }
  return pipe(setComponentName, flatRoutesLevel, joinParentPath, setRouteRedirect)(routes)
}
