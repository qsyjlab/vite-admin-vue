/*
 * @Description: 助手函数
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 10:14:20
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 22:13:29
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
