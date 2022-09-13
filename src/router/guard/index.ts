import type { Router } from 'vue-router'
import { handlePermissionRouter, keepAlive, initApp } from './helper'
import NProgress from 'nprogress'

export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    initApp()
    await handlePermissionRouter(to, from, next, router)
  })

  router.afterEach(to => {
    keepAlive(to)

    NProgress.done()
  })
}
