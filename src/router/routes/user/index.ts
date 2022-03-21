/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 15:21:53
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 14:49:04
 * @FilePath: \vite-admin-vue\src\router\routes\user\index.ts
 */

import { defineExposeRoutes } from '@/utils'
export default defineExposeRoutes([
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      isAuth: false
    },
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/Login.vue')
  }
])
