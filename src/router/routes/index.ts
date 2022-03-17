/*
 * @Description: 路由定义文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 15:32:31
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-17 10:41:52
 * @FilePath: \vite-admin-vue\src\router\routes\index.ts
 */

import { loadRoutes, defineExposeRoutes } from '@/utils'

export const routes = defineExposeRoutes([
  {
    path: '/',
    redirect: { name: 'home' },
    meta: {
      title: '主系统',
      hideInBreadcrumb: true
    },
    children: []
  },
  {
    path: '/',
    name: 'home',
    redirect: { name: 'Welcome' },
    meta: {
      title: '主系统',
      hideInBreadcrumb: true
    },
    component: () => import(/* webpackChunkName: "Home" */ '@/layouts/BasicLayout/BasicLayout.vue'),
    children: loadRoutes(import.meta.globEager('./system/*.ts'))
  }
])

export { routes as default }
