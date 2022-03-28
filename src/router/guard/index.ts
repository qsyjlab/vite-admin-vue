/*
 * @Description: 拦截器入口
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 15:02:43
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-28 22:19:26
 * @FilePath: \vite-admin-vue\src\router\guard\index.ts
 */

import type { Router } from 'vue-router'
// import { useStore } from 'vuex'
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
