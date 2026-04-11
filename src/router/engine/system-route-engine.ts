import { filter } from '@/utils'
import { PermissionModeEnum } from '@/enum'
import router from '@/router'
import { pageError, STATIC_ROUTE_NAME_LIST } from '@/router/routes'
import { loadRouteModules } from '@/router/routes'
import { generateRoutesToMenusHandler, routeConversionHandler } from '@/router/helper'
import { createMatcher } from '@/router/helper/matched'
import { transformObjToRoute } from '@/router/helper/dynamic'
import { createRouteEngine } from './create-route-engine'

import type { RouteRecordRaw } from 'vue-router'
import type { Menu } from '@/router/types'

export interface SystemRouteEngineContext {
  permissionMode: keyof typeof PermissionModeEnum
  permissions: string[]
  roles: Array<string | number>
  backendRoutes?: RouteRecordRaw[]
}

function resolvePermissionRoutes(routes: RouteRecordRaw[], context: SystemRouteEngineContext) {
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
    function roleFilter(route: RouteRecordRaw) {
      const routeRoles = route.meta?.roles?.map(String)
      if (route.meta?.ignoreAuth) return true
      if (!roles?.length) return false
      if (!routeRoles?.length) return true

      const roleSet = new Set(roles.map(String))
      return routeRoles.some(role => roleSet.has(String(role)))
    }

    return filter(routes, roleFilter, { id: 'name' })
  }

  return transformObjToRoute(backendRoutes)
}

export const systemRouteEngine = createRouteEngine<SystemRouteEngineContext, Menu>({
  router,
  staticRouteNames: STATIC_ROUTE_NAME_LIST,
  fallbackRoute: pageError,
  loadRoutes: loadRouteModules,
  authorizeRoutes: resolvePermissionRoutes,
  transformRoutes: routes => {
    createMatcher(routes)
    return routeConversionHandler(routes)
  },
  projectMenus: routes => generateRoutesToMenusHandler(routes)
})
