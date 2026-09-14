import { cloneDeep } from 'lodash-es'
import { filter } from '@/utils/tree-helper/filter'
import { PermissionModeEnum } from '@/enum'
import { transformObjToRoute } from '@/router/helper/dynamic'

import type { RouteRecordRaw } from 'vue-router'
import type { SystemRouteEngineContext } from './types'

/**
 * 角色映射模式专用树过滤
 *
 * 与通用 filter 不同：当父路由的 meta.roles 不匹配时，整棵子树都被移除，
 * 不会因为子路由没有 roles 声明而保留父路由。
 */
export function filterByRole(
  routes: RouteRecordRaw[],
  roles: Array<string | number>
): RouteRecordRaw[] {
  const roleSet = new Set(roles.map(String))

  function filterList(list: RouteRecordRaw[]): RouteRecordRaw[] {
    return list
      .map(route => ({ ...route }))
      .filter(route => {
        // 忽略鉴权的路由直接放行
        if (route.meta?.ignoreAuth) {
          if (route.children) route.children = filterList(route.children)
          return true
        }

        const routeRoles = route.meta?.roles?.map(String)

        // 路由声明了 roles 但用户不具备任何角色 —— 整棵子树移除
        if (routeRoles?.length) {
          const hasRole = routeRoles.some(role => roleSet.has(role))
          if (!hasRole) return false
        }

        // 路由未声明 roles 或用户具备角色 —— 递归处理子路由
        if (route.children) route.children = filterList(route.children)
        return true
      })
  }

  return filterList(routes)
}

export function resolvePermissionRoutes(
  routes: RouteRecordRaw[],
  context: SystemRouteEngineContext
) {
  const { permissionMode, permissions, roles, backendRoutes = [] } = context

  if (permissionMode === PermissionModeEnum.ROUTE_MAPPING) {
    function routeMappingFilter(route: RouteRecordRaw) {
      const name = route.name
      if (!name) return true
      if (route.meta?.ignoreAuth) return true
      return permissions.includes(String(name))
    }

    return filter(routes, routeMappingFilter, { id: 'name' })
  }

  if (permissionMode === PermissionModeEnum.ROLE) {
    return filterByRole(routes, roles)
  }

  // 后端路由属于外部数据且 transformObjToRoute 会原地改写（包 Layout、改名），
  // 在授权边界深拷贝一次，避免污染调用方持有的原始数据
  return transformObjToRoute(cloneDeep(backendRoutes))
}
