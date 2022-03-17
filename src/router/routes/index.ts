/*
 * @Description: 路由定义文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 15:32:31
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-17 15:49:11
 * @FilePath: \vite-admin-vue\src\router\routes\index.ts
 */

import { loadRoutes, defineExposeRoutes } from '@/utils'
import { createBlankContainer } from '@/layouts'

export const routes = defineExposeRoutes([
  {
    path: '/',
    redirect: { name: 'home' },
    meta: {
      title: '主系统',
      hideInBreadcrumb: true
    }
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
  },
  {
    path: '/user',
    name: 'User',
    redirect: { name: 'Login' },
    meta: {
      hideInBreadcrumb: true
    },
    component: createBlankContainer('User'),
    children: loadRoutes(import.meta.globEager('./user/*.ts'))
  }
])

export { routes as default }
