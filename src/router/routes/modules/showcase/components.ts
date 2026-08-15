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
              icon: 'ep.tickets'
            },
            component: () => import('@/views/system/components/pro-table/pro-table-page.vue')
          },
          {
            name: 'ProEditableTable',
            path: 'pro-editable-table',
            meta: {
              title: 'ProEditableTable',
              icon: 'ep.edit'
            },
            component: () =>
              import('@/views/system/components/pro-editable-table/pro-editable-table-page.vue')
          },
          {
            name: 'ProTableSearch',
            path: 'pro-table-search',
            meta: {
              title: 'ProTableSearch',
              icon: 'ep.search'
            },
            component: () =>
              import('@/views/system/components/pro-table-search/pro-table-search-page.vue')
          },
          {
            name: 'ProQueryFilterDemo',
            path: 'pro-query-filter',
            meta: {
              title: 'ProQueryFilter',
              icon: 'ep.filter'
            },
            component: () =>
              import('@/views/system/components/pro-query-filter/pro-query-filter-page.vue')
          },
          {
            name: 'ProDragSortTable',
            path: 'pro-drag-sort-table',
            meta: {
              title: 'ProDragSortTable',
              icon: 'ep.rank'
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
              order: 10
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
          order: 21
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
          order: 22
        },
        component: () => import('@/views/system/components/pro-card/pro-card-page.vue')
      },

      {
        name: 'ProListDemo',
        path: 'pro-list',
        meta: {
          title: 'ProList',
          icon: 'ep.list',
          order: 23
        },
        component: () => import('@/views/system/components/pro-list/pro-list-page.vue')
      },

      {
        name: 'ProEmptyDemo',
        path: 'pro-empty',
        meta: {
          title: 'ProEmpty',
          icon: 'ep.box',
          order: 24
        },
        component: () => import('@/views/system/components/pro-empty/pro-empty-page.vue')
      },

      {
        name: 'ProResultDemo',
        path: 'pro-result',
        meta: {
          title: 'ProResult',
          icon: 'ep.circle-check',
          order: 25
        },
        component: () => import('@/views/system/components/pro-result/pro-result-page.vue')
      },

      {
        name: 'ProSelectDemo',
        path: 'pro-select',
        meta: {
          title: 'ProSelect',
          icon: 'ep.select',
          order: 26
        },
        component: () => import('@/views/system/components/pro-select/pro-select-page.vue')
      },

      {
        name: 'ProRadioGroupDemo',
        path: 'pro-radio-group',
        meta: {
          title: 'ProRadioGroup',
          icon: 'ep.open',
          order: 27
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
          order: 28
        },
        component: () =>
          import('@/views/system/components/pro-checkbox-group/pro-checkbox-group-page.vue')
      },

      {
        name: 'ProCheckCardDemo',
        path: 'pro-check-card',
        meta: {
          title: 'ProCheckCard',
          icon: 'ep.checked',
          order: 29
        },
        component: () => import('@/views/system/components/pro-check-card/pro-check-card-page.vue')
      },

      {
        name: 'ProFieldDemo',
        path: 'pro-field',
        meta: {
          title: 'ProField',
          icon: 'ep.postcard',
          order: 30
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
              icon: 'ep.pointer'
            },
            component: () => import('@/views/system/components/pro-form/pro-form-ref.vue')
          },
          {
            name: 'ProFromDynamic',
            path: 'dynamic',
            meta: {
              title: '动态表单',
              icon: 'ep.refresh-right'
            },
            component: () => import('@/views/system/components/pro-form/dynamic.vue')
          },
          {
            name: 'ProFormModal',
            path: 'modal',
            meta: {
              title: 'Modal 表单',
              icon: 'ep.copy-document'
            },
            component: () => import('@/views/system/components/pro-form/modal-form.vue')
          },
          {
            name: 'ProFormDrawer',
            path: 'drawer',
            meta: {
              title: 'Drawer 表单',
              icon: 'ep.expand'
            },
            component: () => import('@/views/system/components/pro-form/drawer-form.vue')
          },
          {
            name: 'ProFormSteps',
            path: 'steps',
            meta: {
              title: 'StepsForm 表单',
              icon: 'ep.operation'
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
          order: 70
        },
        component: () => import('@/views/system/components/context-menu/context-menu.vue')
      },
      {
        name: 'Tree',
        path: 'tree',
        meta: {
          title: 'Tree',
          icon: 'ep.share',
          order: 50
        },
        children: [
          {
            name: 'TreeSelect',
            path: 'tree-select',
            meta: {
              title: 'ProTreeSelect',
              icon: 'ep.connection'
            },
            component: () =>
              import('@/views/system/components/pro-tree-select/pro-tree-select-page.vue')
          },
          {
            name: 'BaseTree',
            path: 'base',
            meta: {
              title: 'ProTree',
              icon: 'ep.folder-opened'
            },
            component: () => import('@/views/system/components/tree/tree/tree.vue')
          }
        ]
      }
    ]
  }
])
