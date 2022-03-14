/*
 * @Description: 拦截器入口
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 15:02:43
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-13 14:34:35
 * @FilePath: \vite-admin-vue\src\router\guard\index.ts
 */

import type { Router } from 'vue-router'

export function createRouterGuard(router: Router) {
    router.beforeEach((to, from, next) => {
        next()
    })

    router.afterEach((to, from, failure) => {})
}
