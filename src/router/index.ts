import { createRouter, createWebHistory } from 'vue-router'

import { createRouterGuard } from './guard'
import routes from './routes'

import type { App } from 'vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export async function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)

  await router.isReady()
}
