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
    component: () => import(/* webpackChunkName: "Welcome" */ '@/views/system/icon/Icon.vue')
  }
])
