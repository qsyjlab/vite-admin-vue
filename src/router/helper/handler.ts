import { cloneDeep } from 'lodash-es'
import type { RouteRecordRaw } from 'vue-router'
import { treeMap, pipe } from '@/utils'
import { flatRoutesLevel, joinParentPath } from './resolve'
import type { Menu } from '../types'

// 将路由转换成菜单
export function generateRoutesToMenusHandler(routeModList: RouteRecordRaw[]): Menu[] {
  const clonedRoutes = cloneDeep(routeModList)

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
    return routes.sort((prev, next) => {
      return (
        (prev.meta?.order || Number.POSITIVE_INFINITY) -
        (next.meta?.order || Number.POSITIVE_INFINITY)
      )
    })
  }

  // 单层级按钮层级提升
  function promoteSingleChild(menus: RouteRecordRaw[]): RouteRecordRaw[] {
    return menus.map(item => {
      let _temp: RouteRecordRaw = { ...item }
      const children = item.children
      if (children && children.length) {
        _temp.children = promoteSingleChild(children || [])
        if (_temp.children?.length === 1 && _temp.meta?.hideChildrenInMenu !== false)
          _temp = {
            ..._temp.children[0],
            meta: Object.assign(_temp.meta || {}, _temp.children[0].meta)
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
  return pipe(flatRoutesLevel, joinParentPath, setRouteRedirect)(routes)
}
