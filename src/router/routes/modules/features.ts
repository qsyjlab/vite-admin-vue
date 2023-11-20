import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Feature',
    path: '/feature',
    meta: {
      title: '功能',
      icon: 'ify.iconoir:git-fork'
    },
    redirect: '/feature/watermark',
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
            path: 'detail/:id',
            meta: {
              title: '标签栏详情',
              hideInMenu: true
            },
            component: () => import('@/views/system/feature/tab-page/detail.vue')
          }
        ]
      },
      {
        name: 'ImageViewer',
        path: 'image-viewer',
        meta: {
          title: '图片预览'
        },
        component: () => import('@/views/system/feature/image-viwer/image-viwer.vue')
      },
      {
        name: 'Message',
        path: 'message',
        meta: {
          title: '消息提示'
        },
        component: () => import('@/views/system/feature/message/message.vue')
      }
    ]
  }
])
