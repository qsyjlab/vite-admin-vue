/*
 * @Description: 拦截器入口
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 15:02:43
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 21:59:25
 * @FilePath: \vite-admin-vue\src\router\guard\index.ts
 */

import type { Router } from 'vue-router'
// import { useStore } from 'vuex'
import { handlePermissionRouter, keepAlive } from './helper'

export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    await handlePermissionRouter(to, from, next, router)
  })

  router.afterEach(to => {
    keepAlive(to)
  })
}
