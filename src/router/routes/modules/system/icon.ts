import BasicLayout from '@/layouts/basic-layout/basic-layout.vue'
import { defineExposeRoutes } from '@/router'

export default defineExposeRoutes([
  {
    path: '/icon',
    name: 'Icon',
    meta: {
      title: 'Icon 图标',
      sort: 6,
      isNotAuth: true,
      icon: 'icon-folder'
    },
    component: () => import('@/layouts/basic-layout/basic-layout.vue'),
    children: [
      {
        path: '/',
        name: 'IconIndex',
        meta: {
          title: 'Icon 图标',
          sort: 6,
          isNotAuth: true,
          icon: 'icon-folder'
        },
        component: () => import(/* webpackChunkName: "Welcome" */ '@/views/system/icon/Icon.vue')
      }
    ]
  }
])
