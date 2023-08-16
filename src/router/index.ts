import { createWebHistoryRouter } from './helper'

import { setupRouterGuard } from './guard'
import { routes } from './routes'

import type { App } from 'vue'

export const router = createWebHistoryRouter(routes, {
  scrollBehavior: () => ({
    left: 0,
    top: 0,
    behavior: 'smooth'
  })
})

export async function setupRouter(app: App) {
  app.use(router)

  setupRouterGuard(router)

  await router.isReady()
}

export default router

export * from './helper'
