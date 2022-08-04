/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-20 12:02:24
 * @LastEditors: qsyj
 * @LastEditTime: 2022-08-04 14:57:37
 * @FilePath: \vite-admin-vue\src\router\routes\system\components.ts
 */

import { defineExposeRoutes } from '@/utils'
import { createBlankContainer } from '@/layouts'

export default defineExposeRoutes([
  {
    name: 'Components',
    path: 'components',
    meta: {
      title: '组件',
      sort: 4,
      icon: 'icon-document'
    },
    redirect: { name: 'Form' },
    component: createBlankContainer('Components'),
    children: [
      {
        name: 'Form',
        path: 'form',
        meta: {
          title: '表单',
          isNotAuth: true,
          icon: 'icon-upload'
        },
        component: () => import('@/views/system/components/Form.vue')
      },
      {
        name: 'Upload',
        path: 'upload',
        meta: {
          title: '上传',
          isNotAuth: true,
          icon: 'icon-list'
        },
        component: () => import('@/views/system/components/Upload.vue')
      },
      {
        name: 'Table',
        path: 'table',
        meta: {
          title: '表格',
          isNotAuth: true,
          icon: 'icon-cellphone'
        },
        component: () => import('@/views/system/components/Table.vue')
      }
    ]
  }
])
