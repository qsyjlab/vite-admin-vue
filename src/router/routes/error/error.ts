/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 15:55:18
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 16:56:22
 * @FilePath: \vite-admin-vue\src\router\routes\error\error.ts
 */

import { defineExposeRoutes } from '@/utils'

export default defineExposeRoutes([
  {
    path: '/error404',
    name: 'Error404',
    meta: {
      title: '404',
      isAuth: false
    },
    component: () => import('@/views/error/Error404.vue')
  },
  {
    path: '/error403',
    name: 'Error403',
    meta: {
      title: '403',
      isAuth: false
    },
    component: () => import('@/views/error/Error403.vue')
  }
])
