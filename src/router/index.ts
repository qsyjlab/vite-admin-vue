import { createRouter, createWebHistory } from 'vue-router'

import { createRouterGuard } from './guard'
import routes from './routes'

import type { App } from 'vue'

export const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
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
