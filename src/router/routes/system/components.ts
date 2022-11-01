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
