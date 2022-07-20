/*
 * @Description: 助手函数
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 10:14:20
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 15:31:27
 * @FilePath: \vite-admin-vue\src\router\guard\helper.ts
 */

import type {
  RouteLocationNormalized,
  Router,
  NavigationGuardNext,
  RouteRecordRaw
} from 'vue-router'

import { useStorageHelper } from '@/hooks'
import { hasAuth } from '@/utils'
import useStore, { MenuItem, useAppStore, useRouteStore } from '@/store'

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
    await routeStore.initRoutes(transformRouteToList(matched, []))
  }

  return next()
}

/**
 *  组件缓存
 * @param {RouteLocationNormalized} routerTo
 */
export function keepAlive(routerTo: RouteLocationNormalized): void {
  const length = routerTo.matched.length

  const { routeStore } = useStore()

  // TODO: 这种方案不支持 过度动画
  if (length > 1) {
    for (let i = length - 1; i > 0; i--) {
      const [own, parent] = [routerTo.matched[i], routerTo.matched[i - 1]]
      if (!own.meta.isKeepAlive) {
        Object.keys(own.components).forEach(key => {
          if (parent.components.default.name && own.components[key].name) {
            routeStore.addAlive({
              page: parent.components.default.name,
              alive: own.components[key].name
            })
          }
        })
      }
    }
  }
}

/**
 * 初始化
 */
export function initApp() {
  const { getLayoutCache } = useStorageHelper()
  const appStore = useAppStore()

  const layout = getLayoutCache()
  if (layout) {
    appStore.setLayoutConfig(layout)
  }
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
