/*
 * @Description: 助手函数
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 10:14:20
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 17:54:32
 * @FilePath: \vite-admin-vue\src\router\guard\helper.ts
 */

import type { RouteLocationNormalized, Router, NavigationGuardNext } from 'vue-router'

import store from '@/store'
import { useStorageHelper } from '@/hooks'
import { hasAuth } from '@/utils/router/auth'

export async function handlePermissionRouter(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
) {
  const { getTokenCahce } = useStorageHelper()

  const token = getTokenCahce()

  const isLogin = !!token

  if (['Error403', 'Error404', 'Login'].includes(to.name?.toString() || '')) return next()

  if (!isLogin) return next({ name: 'Login' })

  const auth = to.matched?.slice(1)?.every(r => r.meta.isNotAuth || hasAuth(r.name?.toString()))

  if (!auth) return next({ name: 'Error403' })

  if (!store.state.route.isFristEntry) {
    await store.commit('route/initRoutes', to.matched[0]?.children || [])
  }

  return next()
}

/**
 *  组件缓存
 * @param {RouteLocationNormalized} routerTo
 */
export function keepAlive(routerTo: RouteLocationNormalized): void {
  const length = routerTo.matched.length

  if (length > 1) {
    for (let i = length - 1; i > 0; i--) {
      const [own, parent] = [routerTo.matched[i], routerTo.matched[i - 1]]

      if (!own.meta.isKeepAlive) {
        Object.keys(own.components).forEach(key => {
          if (parent.components.default.name && own.components[key].name)
            store.commit('route/addAlive', {
              page: parent.components.default.name,
              alive: own.components[key].name
            })
        })
      }
    }
  }
}
