/*
 * @Description: 主页模块路由
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:05:48
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-25 16:59:25
 * @FilePath: \vite-admin-vue\src\router\routes\system\home.ts
 */

import { defineExposeRoutes } from '@/utils'
import icon from './icon'

export default defineExposeRoutes([
  {
    path: '/welcome',
    name: 'Welcome',
    meta: {
      title: 'Welcome',
      sort: 1,
      icon: 'icon-home-filled'
    },
    component: () => import(/* webpackChunkName: "Welcome" */ '@/views/system/WelcomeTo.vue'),
    children: []
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: 'Dashboard',
      sort: 2,
      icon: 'icon-stopwatch'
    },
    component: () => import('@/views/system/WelcomeTo.vue'),
    children: []
  }
])
