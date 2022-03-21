/*
 * @Description: 主页模块路由
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:05:48
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 13:22:25
 * @FilePath: \vite-admin-vue\src\router\routes\system\home.ts
 */

import { defineExposeRoutes } from '@/utils'

export default defineExposeRoutes([
  {
    path: '/welcome',
    name: 'Welcome',
    meta: {
      title: 'Welcome',
      sort: 1
    },
    component: () => import(/* webpackChunkName: "Welcome" */ '@/views/system/WelcomeTo.vue'),
    children: []
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: 'Dashboard',
      sort: 2
    },
    component: () => import(/* webpackChunkName: "Welcome" */ '@/views/system/WelcomeTo.vue'),
    children: []
  }
])
