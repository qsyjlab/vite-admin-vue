/*
 * @Description: 拦截器入口
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 15:02:43
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 14:54:56
 * @FilePath: \vite-admin-vue\src\router\guard\index.ts
 */

import type { Router } from 'vue-router'
// import { useStore } from 'vuex'
import { handlePermissionRouter } from './helper'

export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    await handlePermissionRouter(to, from, next, router)
  })

  // router.afterEach((to, from, failure) => {})
}
