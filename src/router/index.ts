import { createWebHistoryRouter } from './helper'

import { createRouterGuard } from './guard'
import routes from './routes'

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
  createRouterGuard(router)

  await router.isReady()
}
