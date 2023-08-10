import type { RouteLocationNormalized, Router, NavigationGuardNext } from 'vue-router'

import { useStorageHelper } from '@/hooks'
import { hasAuth } from '@/auth'
import { useRouteStore } from '@/store'
import { buildRoutes } from '../helper/resolve'
import { asyncRoutes, pageError } from '../routes'

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

  const auth =
    true || to.matched?.slice(1)?.every(r => r.meta.isNotAuth || hasAuth(r.name?.toString()))

  if (!auth) return next({ name: 'Error403' })
  if (routeStore.isFristEntry) {
    routeStore.saveMenus([])
    const _buildRoutes = await buildRoutes(asyncRoutes)

    _buildRoutes.forEach(r => {
      router.addRoute(r)
    })

    router.addRoute(pageError)

    if (to.name === 'PageNotFound') {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query })
      return
    }
    const redirectPath = (from.query.redirect || to.path) as string
    const redirect = decodeURIComponent(redirectPath)
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
    next(nextData)

    return
  }
  next()
}
