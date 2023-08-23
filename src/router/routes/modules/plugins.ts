import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Plugins',
    path: '/plugins',
    meta: {
      title: '插件',
      sort: 3,
      icon: 'icon-files'

      // hideChildrenInMenu: true
    },
    redirect: { name: 'DayJs' },
    component: Layout,
    children: [
      {
        name: 'DayJs',
        path: 'dayjs',
        meta: {
          title: 'DayJs',
          icon: 'icon-timer'
        },
        component: () => import('@/views/system/plugins/DayJs.vue')
      },
      {
        name: 'CanvsToPdf',
        path: 'canvs-to-pdf',
        meta: {
          title: 'CanvsToPdf',
          icon: 'icon-camera-filled'
        },
        component: () => import('@/views/system/plugins/CanvsToPdf.vue')
      }
    ]
  }
])
