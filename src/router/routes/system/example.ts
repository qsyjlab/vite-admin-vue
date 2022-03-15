/*
 * @Description: 组件示例
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:14:21
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-15 22:29:36
 * @FilePath: \vite-admin-vue\src\router\routes\system\example.ts
 */

import { defineExposeRoutes } from '@/utils'

export default defineExposeRoutes([
  {
    path: '/card',
    name: 'Card',
    component: () => import(/* webpackChunkName: "Card" */ '@/views/system/WelcomeTo.vue'),
    children: [
      {
        path: '/card',
        name: 'Card',
        component: () => import(/* webpackChunkName: "Card" */ '@/views/system/WelcomeTo.vue'),
        children: []
      },
      {
        path: '/Menu',
        name: 'Menu',
        component: () => import(/* webpackChunkName: "Menu" */ '@/views/system/WelcomeTo.vue'),
        children: []
      },
      {
        path: '/Avatar',
        name: 'Avatar',
        component: () => import(/* webpackChunkName: "Avatar" */ '@/views/system/WelcomeTo.vue'),
        children: []
      }
    ]
  }
])
