import { transformRoutes as menuFilter, transformMenuModule } from './resolve'
import { asyncRoutes } from '../routes/async'

export function getAsyncMenus() {
  const routes = menuFilter(asyncRoutes)

  return routes.map(item => transformMenuModule(item))
}

export function getMenus() {
  return getAsyncMenus()
}
