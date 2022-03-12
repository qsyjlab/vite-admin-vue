/*
 * @Description: 路由定义文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 15:32:31
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-12 18:34:59
 * @FilePath: \vite-admin-vue\src\router\routes\index.ts
 */

import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'home' }
  },
  {
    path: '/',
    name: 'home',
    component: () =>
      import(/* webpackChunkName: "Home" */ '../../components/HelloWorld.vue')
  }
]

export { routes as default }
