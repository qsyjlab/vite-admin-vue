/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 13:18:51
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 13:47:20
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
      sort: 3
    },
    redirect: { name: 'DayJs' },
    component: createBlankContainer('Components'),
    children: [
      {
        name: 'DayJs',
        path: 'dayjs',
        meta: {
          title: 'DayJs'
        },
        component: () => import('@/views/system/plugins/DayJs.vue')
      }
    ]
  }
])
