import router from '@/router'
import { pageError, STATIC_ROUTE_NAME_LIST } from '@/router/routes'
import { loadRouteModules } from '@/router/routes'
import { generateRoutesToMenusHandler, routeConversionHandler } from '@/router/helper'
import { createMatcher } from '@/router/helper/matched'
import { resolvePermissionRoutes } from './authorize'
import { createRouteEngine } from './create-route-engine'

import type { Menu } from '@/router/types'
import type { SystemRouteEngineContext } from './types'

export type { SystemRouteEngineContext } from './types'

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
