/*
 * @Description: 路由定义文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 15:32:31
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 22:40:23
 * @FilePath: \vite-admin-vue\src\router\routes\index.ts
 */

// import type { RouteRecordRaw } from 'vue-router'

import { loadRoutes, defineExposeRoutes } from '@/utils'

export const routes = defineExposeRoutes([
  {
    path: '/',
    redirect: { name: 'home' }
  },
  {
    path: '/',
    name: 'home',
    redirect: { name: 'routes' },
    component: () => import(/* webpackChunkName: "Home" */ '@/layouts/BasicLayout/BasicLayout.vue'),
    children: loadRoutes(import.meta.globEager('./test/*.ts'))
  }
])

export { routes as default }
