import NProgress from 'nprogress'
import { useRouteStore, useUserStore } from '@/store'
import { getTokenCahce, getUserInfoCache } from '@/store/local'
import { usePermissionStore } from '@/store/module/permissions'
import { AxiosCanceler } from '@/service/axios-request/axios-canceler'
import { LOGIN_NAME } from '../constant'
import type { Router } from 'vue-router'
import { emitRoute } from '../listener'
import projectSetting from '@/config/project-setting'
import { WHITE_NAME_LIST } from '../routes'

export function setupRouterGuard(router: Router) {
  createListenerGuard(router)
  createProgressGuard(router)
  createHttpGuard(router)
  createKeepAliveGuard(router)
  createRouterGuard(router)
}

export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 外链
    if (to.meta.href) {
      window.open(to.meta.href)

      return next({ path: from.fullPath, replace: true, query: from.query })
    }

    // 如果忽略直接通过
    if (to.meta.ignoreAuth) return next()

    const { initialized, setInitialized } = useUserStore()
    const permissionStore = usePermissionStore()
    const token = getTokenCahce()

    const isLogin = !!token

    if (!initialized) {
      initializeStore()
    }
    // // 处理基础白名单的路由
    if (WHITE_NAME_LIST.includes(to.name as string)) return next()

    if (!isLogin) {
      const redirectData: { name: string; replace: boolean; query?: Record<string, string> } = {
        name: LOGIN_NAME,
        replace: true,
        query: {}
      }
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.fullPath
        }
      }

      return next(redirectData)
    }

    if (!initialized) {
      await permissionStore.loadDynamicRoutes()
      setInitialized(true)

      if (to.name === 'PageNotFound') {
        return next({ path: to.fullPath, replace: true, query: to.query })
      }
    }

    next()
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
  if (projectSetting.keepAliveCachePolicy === 'normal') {
    router.afterEach(to => {
      const { addAlive } = useRouteStore()

      if (to.meta.ignoreKeepAlive) return
      addAlive(to.name as string)
    })
  }
}

function createHttpGuard(router: Router) {
  const axiosCanceler = new AxiosCanceler()

  router.beforeEach(() => {
    axiosCanceler?.removeAllPending()
  })
}

function createListenerGuard(router: Router) {
  router.beforeEach((to, from) => {
    emitRoute(to, from)
  })
}

// 初始化 store 从 local
function initializeStore() {
  const { setUserInfo, setToken } = useUserStore()
  const userInfo = getUserInfoCache()
  const token = getTokenCahce()

  if (userInfo) {
    setUserInfo(userInfo)
  }

  if (token) {
    setToken(token)
  }
}
