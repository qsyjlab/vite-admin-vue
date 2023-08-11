import { defineExposeRoutes } from '@/router'
import { createBlankContainer } from '@/layouts'

export default defineExposeRoutes([
  {
    name: 'Plugins',
    path: '/plugins',
    meta: {
      title: '插件',
      sort: 3,
      icon: 'icon-files',
      isNotAuth: true
      // hideChildrenInMenu: true
    },
    redirect: { name: 'DayJs' },
    component: () => import('@/layouts/basic-layout/basic-layout.vue'),
    children: [
      {
        name: 'DayJs',
        path: 'dayjs',
        meta: {
          title: 'DayJs',
          icon: 'icon-timer',
          isNotAuth: false
        },
        component: () => import('@/views/system/plugins/DayJs.vue')
      },
      {
        name: 'CanvsToPdf',
        path: 'canvs-to-pdf',
        meta: {
          title: 'CanvsToPdf',
          icon: 'icon-camera-filled',
          isNotAuth: true
        },
        component: () => import('@/views/system/plugins/CanvsToPdf.vue')
      }
    ]
  }
])
