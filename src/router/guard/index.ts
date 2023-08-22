import NProgress from 'nprogress'
import { useRouteStore, useUserStore } from '@/store'
import { getTokenCahce, getUserInfoCache } from '@/store/local'
import { usePermissionStore } from '@/store/module/permissions'
import { AxiosCanceler } from '@/service/axios-request/axios-canceler'
import { LOGIN_NAME, LOGIN_PATH } from '../constant'
import type { Router } from 'vue-router'
import { emitRoute } from '../listener'

export function setupRouterGuard(router: Router) {
  createListenerGuard(router)
  createProgressGuard(router)
  createHttpGuard(router)
  createKeepAliveGuard(router)
  createRouterGuard(router)
}

const WHITE_NAME_LIST = [LOGIN_NAME]

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

    // TODO: 初始化 store 可以放到 store 去做
    if (!initialized) {
      initUserStore()
    }

    // // 处理基础白名单的路由
    if (WHITE_NAME_LIST.includes(to.name as string)) return next()
    // if (whitePathList.includes(to.path)) {
    //   // 这里判定如果当前处于登录状态但是跳转路径是 login 则直接进入系统 redirect | /
    //   if (to.path === ROUTE_ENUM.LOGIN_PATH && isLogin) {
    //     return next((to.query?.redirect as string) || '/')
    //   }

    //   return next()
    // }

    if (!isLogin) {
      const redirectData: { path: string; replace: boolean; query?: Record<string, string> } = {
        path: LOGIN_PATH,
        replace: true
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
        // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
        return next({ path: to.fullPath, replace: true, query: to.query })
      }
    }

    next()

    // function redirectTo() {
    //   const redirectPath = (from.query.redirect || to.path) as string
    //   const redirect = decodeURIComponent(redirectPath)
    //   debugger
    //   const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
    //   next(nextData)
    //   return
    // }
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
function initUserStore() {
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
