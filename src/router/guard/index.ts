import type { Router } from 'vue-router'

import NProgress from 'nprogress'

import { useRouteStore } from '@/store'

import { handlePermissionRouter, initApp } from './helper'

export function setupRouterGuard(router: Router) {
  createProgressGuard(router)
  createSettingGuard(router)
  createKeepAliveGuard(router)
  createRouterGuard(router)
}

export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    initApp()
    await handlePermissionRouter(to, from, next, router)
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

// setting color, layout
export function createSettingGuard(router: Router) {
  router.beforeEach(() => {
    initApp()
  })
}

// components cahce
export function createKeepAliveGuard(router: Router) {
  router.afterEach(to => {
    const { addAlive } = useRouteStore()

    if (to.meta.isKeepAlive && to.name) {
      addAlive([to.name as string])
    }
  })
}
