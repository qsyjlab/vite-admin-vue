import { defineExposeRoutes } from '@/utils'
import { createBlankContainer } from '@/layouts'

export default defineExposeRoutes([
  {
    name: 'Components',
    path: '/components',
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
