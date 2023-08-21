import { defineExposeRoutes } from '@/router'
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
      },
      {
        name: 'TabPage',
        path: 'tab-page',
        meta: {
          title: '标签栏'
        },
        component: () => import('@/views/system/feature/tab-page/tab-page.vue'),
        children: [
          {
            name: 'TabPageDetail',
            path: 'detail',
            meta: {
              title: '标签栏详情',
              hideInMenu: true
            },
            component: () => import('@/views/system/feature/tab-page/detail.vue')
          }
        ]
      }
    ]
  }
])
