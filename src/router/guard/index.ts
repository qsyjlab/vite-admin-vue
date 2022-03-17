/*
 * @Description: 拦截器入口
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 15:02:43
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-17 15:49:35
 * @FilePath: \vite-admin-vue\src\router\guard\index.ts
 */

import type { Router } from 'vue-router'
// import { useStore } from 'vuex'
import { handlePermissionRouter } from './helper'

import store from '@/store'

export function createRouterGuard(router: Router) {
  // const store = useStore()

  router.beforeEach(async (to, from, next) => {
    // console.log(store)

    // console.log('to', to)

    // await store.commit('route/initRoutes', to.matched[0]?.children || [])
    // await handlePermissionRouter(to, from, next)
    next()
  })

  router.afterEach((to, from, failure) => {
    console.log('after router')
  })
}
