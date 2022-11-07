import type {
  RouteLocationNormalized,
  Router,
  NavigationGuardNext,
  RouteRecordRaw
} from 'vue-router'

import { useStorageHelper } from '@/hooks'
import { hasAuth } from '@/utils'
import { MenuItem, useAppStore, useRouteStore } from '@/store'
import routes from '../routes'

export async function handlePermissionRouter(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
) {
  if (to.meta.href) {
    window.open(to.meta.href)

    return next({ path: from.fullPath, replace: true, query: from.query })
  }
  const { getTokenCahce } = useStorageHelper()

  const routeStore = useRouteStore()

  const token = getTokenCahce()

  const isLogin = !!token

  if (['Error403', 'Error404', 'Login'].includes(to.name?.toString() || '')) return next()

  if (!isLogin) return next({ name: 'Login' })

  const auth = to.matched?.slice(1)?.every(r => r.meta.isNotAuth || hasAuth(r.name?.toString()))

  if (!auth) return next({ name: 'Error403' })

  if (!routeStore.isFristEntry) {
    const matched = to.matched[0].children

    const buildRoutes = await routeStore.buildRoutes(routes)

    buildRoutes.forEach(r => {
      router.addRoute(r)
    })

    await routeStore.initRoutes(transformRouteToList(matched, []))
  }

  return next()
}

/**
 *
 * @param { RouteRecordRaw[] } routes
 * @param { MenuItem[]} treeMap
 * @returns
 */
export function transformRouteToList(routes: RouteRecordRaw[], treeMap: MenuItem[]): MenuItem[] {
  if (routes && routes?.length === 0) return []

  return routes
    .reduce((acc, cur) => {
      if (cur.meta?.isNotAuth || hasAuth(cur.name as string)) {
        acc.push({
          name: cur.name as string,
          meta: cur.meta,
          children: transformRouteToList(cur.children || [], [])
        })
      }
      return acc
    }, treeMap)
    .reverse()
    .sort((last, next) => (last.meta?.sort || 0) - (next.meta?.sort || 0))
}
