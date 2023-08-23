import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    path: '/icon',
    name: 'Icon',
    meta: {
      title: 'Icon 图标',
      sort: 6,

      icon: 'icon-folder'
    },
    component: Layout,
    children: [
      {
        path: '/',
        name: 'IconIndex',
        meta: {
          title: 'Icon 图标',
          sort: 6,

          icon: 'icon-folder'
        },
        component: () => import(/* webpackChunkName: "Welcome" */ '@/views/system/icon/Icon.vue')
      }
    ]
  }
])
