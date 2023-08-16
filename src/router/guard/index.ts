import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

import NProgress from 'nprogress'
import { useRouteStore, useUserStore } from '@/store'
import { getTokenCahce } from '@/store/local'
import { hasAuth } from '@/auth'
import { pageError } from '../routes'

export function setupRouterGuard(router: Router) {
  createProgressGuard(router)
  createKeepAliveGuard(router)
  createRouterGuard(router)
}

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

  const { initialized, setInitialized } = useUserStore()

  if (!initialized) {
    initUserStore()
  }
  const routeStore = useRouteStore()

  const token = getTokenCahce()

  const isLogin = !!token

  if (['Error403', 'Error404', 'Login'].includes(to.name?.toString() || '')) return next()

  if (!isLogin) return next({ name: 'Login' })

  const auth =
    true || to.matched?.slice(1)?.every(r => r.meta.isNotAuth || hasAuth(r.name?.toString()))

  if (!auth) return next({ name: 'Error403' })

  if (!initialized) {
    const dynamicRoutes = await routeStore.buildRoutes()
    routeStore.addRouteBatch(dynamicRoutes)

    router.addRoute(pageError)
    setInitialized(true)

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

export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    await handlePermissionRouter(to, from, next, router)
  })
}

// progresss
export function createProgressGuard(router: Router) {
  router.beforeEach(() => {
    NProgress.start()
  })

  router.afterEach(() => {
    NProgress.done()
  })
}

// components cahce
export function createKeepAliveGuard(router: Router) {
  router.afterEach(to => {
    const { addAlive } = useRouteStore()

    if (to.meta.isKeepAlive && to.name) {
      addAlive(to.name as string)
    }
  })
}

function initUserStore() {}
