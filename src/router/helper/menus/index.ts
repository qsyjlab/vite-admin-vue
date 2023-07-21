import { transformRoutes as menuFilter, transformMenuModule } from '@/router/helper'
import { asyncRoutes } from '../../routes'

export function getAsyncMenus() {
  const routes = menuFilter(asyncRoutes)

  return routes.map(item => transformMenuModule(item))
}

export function getMenus() {
  return getAsyncMenus()
}
