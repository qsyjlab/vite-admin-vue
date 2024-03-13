import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    path: '/hooks',
    name: 'Hooks',
    meta: {
      title: 'Hooks',

      icon: 'svg.hooks',
      hideChildrenInMenu: false
    },
    redirect: {
      name: 'UseDialog'
    },
    component: Layout,
    children: [
      {
        path: 'use-dialog',
        name: 'UseDialog',
        meta: {
          title: 'useDialog',
          icon: 'ep.home-filled'
        },
        component: () =>
          import(/* webpackChunkName: "useDialog" */ '@/views/system/hooks/modal/modal.vue')
      }
    ]
  }
])
