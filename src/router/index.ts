import { createWebHistoryRouter } from './helper'

import { setupRouterGuard } from './guard'
import { routes, STATIC_ROUTE_NAME_LIST } from './routes'

import type { App } from 'vue'

export const router = createWebHistoryRouter(routes, {
  scrollBehavior: () => ({
    left: 0,
    top: 0
  })
})

export async function setupRouter(app: App) {
  app.use(router)

  setupRouterGuard(router)

  await router.isReady()
}

// 重置路由
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !STATIC_ROUTE_NAME_LIST.includes(name as string)) {
      if (!router.hasRoute(name)) return
      router.removeRoute(name)
    }
  })
}

export default router

export * from './helper'

export { routeChangeListener } from './helper/listener'
export { resolveMatched } from './helper/matched'
