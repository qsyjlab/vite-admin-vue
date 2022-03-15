/*
 * @Description: 路由定义文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 15:32:31
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-15 22:07:57
 * @FilePath: \vite-admin-vue\src\router\routes\index.ts
 */

import { loadRoutes, defineExposeRoutes } from '@/utils'

export const routes = defineExposeRoutes([
  {
    path: '/',
    redirect: { name: 'home' }
  },
  {
    path: '/',
    name: 'home',
    redirect: { name: 'Welcome' },
    component: () => import(/* webpackChunkName: "Home" */ '@/layouts/BasicLayout/BasicLayout.vue'),
    children: loadRoutes(import.meta.globEager('./system/*.ts'))
  }
])

export { routes as default }
