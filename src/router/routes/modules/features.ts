import { defineExposeRoutes } from '@/router'
import { createBlankContainer } from '@/layouts'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Feature',
    path: '/feature',
    meta: {
      title: '功能',
      icon: 'icon-document'
    },
    redirect: '/feature/watermark2',
    component: Layout,
    children: [
      {
        name: 'Watermark',
        path: 'watermark',
        meta: {
          title: '水印'
        },
        component: () => import('@/views/system/feature/watermark/watermark.vue')
      },
      {
        name: 'Qrcode',
        path: 'qrcode',
        meta: {
          title: '二维码'
        },
        component: () => import('@/views/system/feature/qrcode/qrcode.vue')
      }
    ]
  }
])
