/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-23 21:46:50
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-23 21:48:01
 * @FilePath: \vite-admin-vue\src\router\routes\system\icon.ts
 */

import { defineExposeRoutes } from '@/utils'

export default defineExposeRoutes([
  {
    path: '/icon',
    name: 'Icon',
    meta: {
      title: 'Icon 图标',
      sort: 6,
      isNotAuth: true
    },
    component: () => import(/* webpackChunkName: "Welcome" */ '@/views/system/icon/Icon.vue')
  }
])
