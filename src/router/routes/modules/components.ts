import { defineExposeRoutes } from '@/router'
import { Layout, BlankContainer } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Components',
    path: '/components',
    meta: {
      title: '组件',
      icon: 'ep.grid'
    },
    redirect: { name: 'ProTable' },
    component: Layout,
    children: [
      {
        name: 'ProTable',
        path: 'pro-table',
        meta: {
          title: 'ProTable'
        },
        component: BlankContainer,
        redirect: {
          name: 'ProTableBasic'
        },
        children: [
          {
            name: 'ProTableBasic',
            path: 'pro-table-basic',
            meta: {
              title: 'ProTable 基本使用'
            },
            component: () => import('@/views/system/components/pro-table/pro-table-page.vue')
          },
          {
            name: 'ProTableEdit',
            path: 'pro-table-edit',
            meta: {
              title: 'ProTable edit 基本使用',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/pro-table-edit/pro-table-edit.vue')
          },
          {
            name: 'EditableProTable',
            path: 'editable-pro-table',
            meta: {
              title: 'EditableProTable',
              ignoreAuth: true
            },
            component: () =>
              import('@/views/system/components/editable-pro-table/editable-pro-table.vue')
          },
          {
            name: 'DragSortTable',
            path: 'drag-sort-table',
            meta: {
              title: 'DragSortTable',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/drag-sort-table/drag-sort-table.vue')
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
        component: BlankContainer,
        children: [
          {
            name: 'ProFormBase',
            path: 'base',
            meta: {
              title: '基础表单'
            },
            component: () => import('@/views/system/components/pro-form/pro-form-page.vue')
          },
          {
            name: 'ProFormRef',
            path: 'ref',
            meta: {
              title: '表单 ref 操作',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/pro-form/pro-form-ref.vue')
          },
          {
            name: 'ProFromDynamic',
            path: 'dynamic',
            meta: {
              title: '动态表单',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/pro-form/dynamic.vue')
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
        name: 'Anchor',
        path: 'anchor',
        meta: {
          title: '锚点'
        },
        component: () => import('@/views/system/components/anchor/anchor-demo.vue')
      },
      {
        name: 'Segmented',
        path: 'segmented',
        meta: {
          title: 'segmented 分段器'
        },
        component: () => import('@/views/system/components/segmented/segmented.vue')
      },
      {
        name: 'ContextMenu',
        path: 'context-menu',
        meta: {
          title: '右键菜单',
          ignoreAuth: true
        },
        component: () => import('@/views/system/components/context-menu/context-menu.vue')
      },
      {
        name: 'Tree',
        path: 'tree',
        meta: {
          title: 'Tree',
          ignoreAuth: true
        },
        component: BlankContainer,
        children: [
          {
            name: 'TreeSelect',
            path: 'tree-select',
            meta: {
              ignoreAuth: true,
              title: 'TreeSelect'
            },
            component: () => import('@/views/system/components/tree/tree-select.vue')
          },
          {
            name: 'BaseTree',
            path: 'base',
            meta: {
              title: 'Tree',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/tree/tree/tree.vue')
          }
        ]
      }
    ]
  }
])
