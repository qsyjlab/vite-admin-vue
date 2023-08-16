import { transformRoutes as menuFilter, transformMenuModule } from './resolve'
import { asyncRoutes } from '../routes/async'
import { filter } from '@/utils'
import { hasAuth } from '@/auth'

export function getAsyncMenus() {
  const routes = menuFilter(asyncRoutes)

  return filter(routes, route => hasAuth(route.name as string)).map(item =>
    transformMenuModule(item)
  )
}

export function getMenus() {
  return getAsyncMenus()
}
