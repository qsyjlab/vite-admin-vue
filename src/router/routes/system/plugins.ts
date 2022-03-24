/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 13:18:51
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-24 21:45:32
 * @FilePath: \vite-admin-vue\src\router\routes\system\plugins.ts
 */

import { defineExposeRoutes } from '@/utils'
import { createBlankContainer } from '@/layouts'

export default defineExposeRoutes([
  {
    name: 'Plugins',
    path: 'plugins',
    meta: {
      title: '插件',
      sort: 3,
      icon: 'icon-files',
      isNotAuth: true
    },
    redirect: { name: 'DayJs' },
    component: createBlankContainer('Components'),
    children: [
      {
        name: 'DayJs',
        path: 'dayjs',
        meta: {
          title: 'DayJs',
          icon: 'icon-timer',
          isNotAuth: true
        },
        component: () => import('@/views/system/plugins/DayJs.vue')
      }
    ]
  }
])
