/*
 * @Description: router 入口文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 14:51:52
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-10 22:39:39
 * @FilePath: \vite-admin-vue\src\router\index.ts
 */

import { createRouter, createWebHistory } from 'vue-router'

import { createRouterGuard } from './guard'
import routes from './routes'

import type { App } from 'vue';


export const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes
})


export async function setupRouter (app:App){

    app.use(router)
    createRouterGuard(router)

    await router.isReady()
}
