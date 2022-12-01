import type { RouteLocationNormalized, Router, NavigationGuardNext } from 'vue-router'

import { useStorageHelper } from '@/hooks'
import { hasAuth } from '@/utils'
import { useRouteStore } from '@/store'
import { buildRoutes, resolveRouteTreeToList, transformRoutes } from '../helper'

export async function handlePermissionRouter(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
) {
  // 外链
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

  const module = to.matched[0]

  if (!module.name) {
    console.error('Route name Missing')
    return
  }

  // 路由拍平重新注册规则
  if (
    !routeStore.routeMapping[module.name as string] ||
    !routeStore.routeMapping[module.name as string].isFlat
  ) {
    const menus = transformRoutes(module.children, [])
    const _buildRoutes = buildRoutes([module])

    const { relationObj: relation } = resolveRouteTreeToList(module.children)

    routeStore.saveRoutesRelation(module.name as string, {
      menus,
      relation
    })

    _buildRoutes.forEach(r => {
      router.addRoute(r)
    })
  }

  return next()
}
