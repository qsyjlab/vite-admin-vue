import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Components',
    path: '/components',
    meta: {
      title: '组件',
      icon: 'ep.grid',
      order: 30
    },
    redirect: { name: 'ProTable' },
    component: Layout,
    children: [
      {
        name: 'ProTable',
        path: 'pro-table',
        meta: {
          title: 'ProTable',
          icon: 'ep.list',
          order: 10
        },
        redirect: {
          name: 'ProTableBasic'
        },
        children: [
          {
            name: 'ProTableBasic',
            path: 'pro-table-basic',
            meta: {
              title: 'ProTable 基本使用',
              icon: 'ep.tickets',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/pro-table/pro-table-page.vue')
          },
          {
            name: 'ProEditableTable',
            path: 'pro-editable-table',
            meta: {
              title: 'ProEditableTable',
              icon: 'ep.edit',
              ignoreAuth: true
            },
            component: () =>
              import('@/views/system/components/pro-editable-table/pro-editable-table-page.vue')
          },
          {
            name: 'ProTableSearch',
            path: 'pro-table-search',
            meta: {
              title: 'ProTableSearch',
              icon: 'ep.search',
              ignoreAuth: true
            },
            component: () =>
              import('@/views/system/components/pro-table-search/pro-table-search-page.vue')
          },
          {
            name: 'ProDragSortTable',
            path: 'pro-drag-sort-table',
            meta: {
              title: 'ProDragSortTable',
              icon: 'ep.rank',
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
          title: '编辑器',
          icon: 'ep.edit-pen',
          order: 30
        },
        redirect: { name: 'ProCodeEditor' },
        children: [
          {
            name: 'ProCodeEditor',
            path: 'pro-code-editor',
            meta: {
              title: 'ProCodeEditor',
              icon: 'ep.code',
              order: 10,
              ignoreAuth: true
            },
            component: () =>
              import('@/views/system/components/pro-code-editor/pro-code-editor-page.vue')
          },
          {
            name: 'RichEditor',
            path: 'rich-editor',
            meta: {
              title: 'tinymce富文本',
              icon: 'ep.document'
            },
            component: () => import('@/views/system/components/rich-editor/rich-editor.vue')
          }
        ]
      },

      {
        name: 'ProConfigProviderDemo',
        path: 'pro-config-provider',
        meta: {
          title: 'ProConfigProvider',
          icon: 'ep.setting',
          order: 21,
          ignoreAuth: true
        },
        component: () =>
          import('@/views/system/components/pro-config-provider/pro-config-provider-page.vue')
      },

      {
        name: 'ProCardDemo',
        path: 'pro-card',
        meta: {
          title: 'ProCard',
          icon: 'ep.postcard',
          order: 22,
          ignoreAuth: true
        },
        component: () => import('@/views/system/components/pro-card/pro-card-page.vue')
      },

      {
        name: 'ProListDemo',
        path: 'pro-list',
        meta: {
          title: 'ProList',
          icon: 'ep.list',
          order: 23,
          ignoreAuth: true
        },
        component: () => import('@/views/system/components/pro-list/pro-list-page.vue')
      },

      {
        name: 'ProEmptyDemo',
        path: 'pro-empty',
        meta: {
          title: 'ProEmpty',
          icon: 'ep.box',
          order: 24,
          ignoreAuth: true
        },
        component: () => import('@/views/system/components/pro-empty/pro-empty-page.vue')
      },

      {
        name: 'ProSelectDemo',
        path: 'pro-select',
        meta: {
          title: 'ProSelect',
          icon: 'ep.select',
          order: 25,
          ignoreAuth: true
        },
        component: () => import('@/views/system/components/pro-select/pro-select-page.vue')
      },

      {
        name: 'ProRadioGroupDemo',
        path: 'pro-radio-group',
        meta: {
          title: 'ProRadioGroup',
          icon: 'ep.open',
          order: 26,
          ignoreAuth: true
        },
        component: () =>
          import('@/views/system/components/pro-radio-group/pro-radio-group-page.vue')
      },

      {
        name: 'ProCheckboxGroupDemo',
        path: 'pro-checkbox-group',
        meta: {
          title: 'ProCheckboxGroup',
          icon: 'ep.finished',
          order: 27,
          ignoreAuth: true
        },
        component: () =>
          import('@/views/system/components/pro-checkbox-group/pro-checkbox-group-page.vue')
      },

      {
        name: 'ProFieldDemo',
        path: 'pro-field',
        meta: {
          title: 'ProField',
          icon: 'ep.postcard',
          order: 28,
          ignoreAuth: true
        },
        component: () => import('@/views/system/components/pro-field/pro-field-page.vue')
      },

      {
        name: 'ProForm',
        path: 'pro-form',
        meta: {
          title: 'ProForm',
          icon: 'ep.memo',
          order: 20
        },
        children: [
          {
            name: 'ProFormBase',
            path: 'base',
            meta: {
              title: '基础表单',
              icon: 'ep.document-add'
            },
            component: () => import('@/views/system/components/pro-form/pro-form-page.vue')
          },
          {
            name: 'ProFormRef',
            path: 'ref',
            meta: {
              title: '表单 ref 操作',
              icon: 'ep.pointer',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/pro-form/pro-form-ref.vue')
          },
          {
            name: 'ProFromDynamic',
            path: 'dynamic',
            meta: {
              title: '动态表单',
              icon: 'ep.refresh-right',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/pro-form/dynamic.vue')
          },
          {
            name: 'ProFormModal',
            path: 'modal',
            meta: {
              title: 'Modal 表单',
              icon: 'ep.copy-document',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/pro-form/modal-form.vue')
          },
          {
            name: 'ProFormDrawer',
            path: 'drawer',
            meta: {
              title: 'Drawer 表单',
              icon: 'ep.expand',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/pro-form/drawer-form.vue')
          },
          {
            name: 'ProFormSteps',
            path: 'steps',
            meta: {
              title: 'StepsForm 表单',
              icon: 'ep.operation',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/pro-form/steps-form.vue')
          }
        ]
      },
      {
        name: 'Upload',
        path: 'upload',
        meta: {
          title: '上传',
          icon: 'ep.upload-filled',
          order: 40
        },
        component: () => import('@/views/system/components/pro-upload/pro-upload-page.vue')
      },
      {
        name: 'Anchor',
        path: 'anchor',
        meta: {
          title: '锚点',
          icon: 'ep.position',
          order: 80
        },
        component: () => import('@/views/system/components/anchor/anchor-demo.vue')
      },
      {
        name: 'Segmented',
        path: 'segmented',
        meta: {
          title: 'segmented 分段器',
          icon: 'ep.more-filled',
          order: 60
        },
        component: () => import('@/views/system/components/segmented/segmented.vue')
      },
      {
        name: 'ContextMenu',
        path: 'context-menu',
        meta: {
          title: '右键菜单',
          icon: 'ep.menu',
          order: 70,
          ignoreAuth: true
        },
        component: () => import('@/views/system/components/context-menu/context-menu.vue')
      },
      {
        name: 'Tree',
        path: 'tree',
        meta: {
          title: 'Tree',
          icon: 'ep.share',
          order: 50,
          ignoreAuth: true
        },
        children: [
          {
            name: 'TreeSelect',
            path: 'tree-select',
            meta: {
              ignoreAuth: true,
              title: 'TreeSelect',
              icon: 'ep.connection'
            },
            component: () => import('@/views/system/components/tree/tree-select.vue')
          },
          {
            name: 'BaseTree',
            path: 'base',
            meta: {
              title: 'Tree',
              icon: 'ep.folder-opened',
              ignoreAuth: true
            },
            component: () => import('@/views/system/components/tree/tree/tree.vue')
          }
        ]
      }
    ]
  }
])
