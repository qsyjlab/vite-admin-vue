import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Feature',
    path: '/feature',
    meta: {
      title: '功能',
      icon: 'svg.git-fork',
      order: 40
    },
    redirect: '/feature/watermark',
    component: Layout,
    children: [
      {
        name: 'Watermark',
        path: 'watermark',
        meta: {
          title: '水印',
          icon: 'ep.postcard',
          order: 10
        },
        component: () => import('@/views/system/feature/watermark/watermark.vue')
      },
      {
        name: 'Qrcode',
        path: 'qrcode',
        meta: {
          title: '二维码',
          icon: 'ep.grid',
          order: 20
        },
        component: () => import('@/views/system/feature/qrcode/qrcode.vue')
      },
      {
        name: 'TabPage',
        path: 'tab-page',
        meta: {
          title: '标签栏',
          icon: 'ep.collection-tag',
          order: 30
        },
        component: () => import('@/views/system/feature/tab-page/tab-page.vue'),
        children: [
          {
            name: 'TabPageDetail',
            path: 'detail/:id',
            meta: {
              title: '标签栏详情',
              icon: 'ep.tickets',
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
          title: '图片预览',
          icon: 'ep.picture',
          order: 40
        },
        component: () => import('@/views/system/feature/image-viwer/image-viwer.vue')
      },
      {
        name: 'Download',
        path: 'download',
        meta: {
          title: '文件下载',
          icon: 'ep.download',
          order: 50
        },
        component: () => import('@/views/system/feature/download/download.vue')
      },
      {
        name: 'Message',
        path: 'message',
        meta: {
          title: '消息提示',
          icon: 'ep.chat-dot-round',
          order: 60
        },
        component: () => import('@/views/system/feature/message/message.vue')
      },
      {
        name: 'Encrypt',
        path: 'encrypt',
        meta: {
          title: '加密',
          icon: 'ep.lock',
          order: 70
        },
        component: () => import('@/views/system/feature/encrypt/encrypt.vue')
      },
      {
        name: 'Print',
        path: 'print',
        meta: {
          title: '打印',
          icon: 'ep.printer',
          order: 80
        },
        component: () => import('@/views/system/feature/print/print.vue')
      },
      {
        name: 'Pdf',
        path: 'pdf',
        meta: {
          title: 'Pdf',
          icon: 'ep.document',
          order: 90,
          hideChildrenInMenu: false
        },
        children: [
          {
            name: 'PdfPreview',
            path: 'preview',
            meta: {
              title: '在线预览',
              icon: 'ep.view',
              order: 90
            },
            component: () => import('@/views/system/feature/pdf/pdf-preview.vue')
          }
        ]
      },
      {
        name: 'Excel',
        path: 'excel',
        meta: {
          title: 'Excel',
          icon: 'ep.files',
          order: 100
        },
        children: [
          {
            name: 'ExcelPreview',
            path: 'preview',
            meta: {
              title: '在线预览',
              icon: 'ep.view'
            },
            component: () => import('@/views/system/feature/excel/preview.vue')
          },
          {
            name: 'ExcelBase',
            path: 'base',
            meta: {
              title: '基本导出',
              icon: 'ep.download'
            },
            component: () => import('@/views/system/feature/excel/base/excel.vue')
          },
          {
            name: 'ExcelBaseMutiHeader',
            path: 'mutiple-header',
            meta: {
              title: '多表头',
              icon: 'ep.grid'
            },
            component: () =>
              import('@/views/system/feature/excel/mutiple-header/mutiple-header.vue')
          },
          {
            name: 'ExcelImport',
            path: 'import',
            meta: {
              title: '导入',
              icon: 'ep.upload'
            },
            component: () => import('@/views/system/feature/excel/import.vue')
          }
        ]
      },
      {
        name: 'docx',
        path: 'docx',
        meta: {
          title: 'docx',
          icon: 'ep.document-copy',
          order: 110,
          hideChildrenInMenu: false
        },
        children: [
          {
            name: 'HtmlToDocx',
            path: 'html-to-docx',
            meta: {
              title: '富文本导出docx',
              icon: 'ep.edit-pen'
            },
            component: () => import('@/views/system/feature/docx/html-to-docx.vue')
          },
          {
            name: 'HtmlToDocxPreview',
            path: 'html-to-docx-preview',
            meta: {
              title: '在线预览docx',
              icon: 'ep.view'
            },
            component: () => import('@/views/system/feature/docx/docx-preview.vue')
          }
        ]
      }
    ]
  }
])
