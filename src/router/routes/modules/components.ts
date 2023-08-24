import { defineExposeRoutes } from '@/router'
import { Layout, BlankContainer } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Components',
    path: '/components',
    meta: {
      title: '组件',
      sort: 4,
      icon: 'ify.bxs:component'
    },
    redirect: { name: 'Form' },
    component: Layout,
    children: [
      {
        name: 'ProTable',
        path: 'pro-table',
        meta: {
          title: 'ProTable'
        },
        component: BlankContainer,
        children: [
          {
            name: 'ProTableBasic',
            path: 'pro-table-basic',
            meta: {
              title: 'ProTable 基本使用'
            },
            component: () => import('@/views/system/components/pro-table/pro-table.vue')
          }
        ]
      },

      {
        name: 'Editor',
        path: 'editor',
        meta: {
          title: '编辑器'
        },
        component: BlankContainer,
        redirect: { name: 'RichEditor' },
        children: [
          {
            name: 'RichEditor',
            path: 'rich-editor',
            meta: {
              title: 'tinymce富文本'
            },
            component: () => import('@/views/system/components/rich-editor/rich-editor.vue')
          }
        ]
      },

      {
        name: 'ProForm',
        path: 'pro-form',
        meta: {
          title: 'ProForm'
        },
        children: [
          {
            name: 'ProFormBase',
            path: 'base',
            meta: {
              title: '基础表单'
            },
            component: () => import('@/views/system/components/pro-form/pro-form.vue')
          },
          {
            name: 'ProFormModal',
            path: 'modal',
            meta: {
              title: 'Modal 表单'
            },
            component: () => import('@/views/system/components/pro-form/modal-form.vue')
          },
          {
            name: 'ProFormDrawer',
            path: 'drawer',
            meta: {
              title: 'Drawer 表单'
            },
            component: () => import('@/views/system/components/pro-form/drawer-form.vue')
          },
          {
            name: 'ProFormSteps',
            path: 'steps',
            meta: {
              title: 'StepsForm 表单'
            },
            component: () => import('@/views/system/components/pro-form/steps-form.vue')
          }
        ]
      },
      {
        name: 'Upload',
        path: 'upload',
        meta: {
          title: '上传'
        },
        component: () => import('@/views/system/components/Upload.vue')
      },
      {
        name: 'DargSort',
        path: 'drag-sort',
        meta: {
          title: '拖拽排序'
        },
        component: () => import('@/views/system/components/drag-sort/drag-sort.vue')
      },
      {
        name: 'Table',
        path: 'table',
        meta: {
          title: '表格'
        },
        component: () => import('@/views/system/components/Table.vue')
      },
      {
        name: 'Anchor',
        path: 'anchor',
        meta: {
          title: '锚点'
        },
        component: () => import('@/views/system/components/anchor/anchor-demo.vue')
      }
    ]
  }
])
