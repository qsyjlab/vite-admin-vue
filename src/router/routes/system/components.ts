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
        name: 'ProTable',
        path: 'pro-table',
        meta: {
          title: 'ProTable',
          isNotAuth: true
        },
        component: createBlankContainer('ProTable'),
        children: [
          {
            name: 'ProTableBasic',
            path: 'pro-table-basic',
            meta: {
              title: 'ProTable 基本使用',
              isNotAuth: true
            },
            component: () => import('@/views/system/components/pro-table/pro-table.vue')
          }
        ]
      },

      {
        name: 'Editor',
        path: 'editor',
        meta: {
          title: '编辑器',
          isNotAuth: true
        },
        component: createBlankContainer('Editor'),
        children: [
          {
            name: 'RichEditor',
            path: 'rich-editor',
            meta: {
              title: 'tinymce富文本',
              isNotAuth: true
            },
            component: () => import('@/views/system/components/rich-editor/rich-editor.vue')
          }
        ]
      },

      {
        name: 'ProForm',
        path: 'pro-form',
        meta: {
          title: 'ProForm',
          isNotAuth: true,
          icon: 'icon-upload'
        },
        component: () => import('@/views/system/components/pro-form/pro-form.vue')
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
        name: 'DargSort',
        path: 'drag-sort',
        meta: {
          title: '拖拽排序',
          isNotAuth: true,
          icon: 'icon-cellphone'
        },
        component: () => import('@/views/system/components/drag-sort/drag-sort.vue')
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
      },
      {
        name: 'grid',
        path: 'grid',
        meta: {
          title: '响应栅格',
          isNotAuth: true,
          icon: 'icon-upload'
        },
        component: () => import('@/views/system/components/grid.vue')
      }
    ]
  }
])
