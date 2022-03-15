/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 16:24:34
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 22:40:58
 * @FilePath: \vite-admin-vue\src\router\routes\test\index.ts
 */

import { defineExposeRoutes } from '@/utils'

export default defineExposeRoutes([
  {
    name: 'routes',
    path: 'routes',
    meta: {
      title: '测试'
    },
    component: () => import('@/components/HelloWorld.vue'),
    // redirect: {},
    children: [
      {
        name: 'routes2',
        path: '/routes2',
        meta: {
          title: '测试'
        },
        redirect: {},
        children: []
      }
    ]
  }
])
