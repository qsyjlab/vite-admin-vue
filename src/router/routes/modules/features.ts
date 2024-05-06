import { defineExposeRoutes } from '@/router'
import { BlankContainer, Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Feature',
    path: '/feature',
    meta: {
      title: '功能',
      icon: 'svg.git-fork'
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
        name: 'Download',
        path: 'download',
        meta: {
          title: '文件下载',
          ignoreAuth: true
        },
        component: () => import('@/views/system/feature/download/download.vue')
      },
      {
        name: 'Message',
        path: 'message',
        meta: {
          title: '消息提示'
        },
        component: () => import('@/views/system/feature/message/message.vue')
      },
      {
        name: 'Encrypt',
        path: 'encrypt',
        meta: {
          title: '加密'
        },
        component: () => import('@/views/system/feature/encrypt/encrypt.vue')
      },
      {
        name: 'Print',
        path: 'print',
        meta: {
          title: '打印',
          ignoreAuth: true
        },
        component: () => import('@/views/system/feature/print/print.vue')
      },
      {
        name: 'Pdf',
        path: 'pdf',
        meta: {
          title: 'Pdf',
          ignoreAuth: true,
          hideChildrenInMenu: false
        },
        children: [
          {
            name: 'PdfPreview',
            path: 'preview',
            meta: {
              title: '在线预览',
              ignoreAuth: true
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
          ignoreAuth: true
        },
        component: BlankContainer,
        children: [
          {
            name: 'ExcelPreview',
            path: 'preview',
            meta: {
              title: '在线预览',
              ignoreAuth: true
            },
            component: () => import('@/views/system/feature/excel/preview.vue')
          },
          {
            name: 'ExcelBase',
            path: 'base',
            meta: {
              title: '基本导出',
              ignoreAuth: true
            },
            component: () => import('@/views/system/feature/excel/base/excel.vue')
          },
          {
            name: 'ExcelBaseMutiHeader',
            path: 'mutiple-header',
            meta: {
              title: '多表头',
              ignoreAuth: true
            },
            component: () =>
              import('@/views/system/feature/excel/mutiple-header/mutiple-header.vue')
          },
          {
            name: 'ExcelImport',
            path: 'import',
            meta: {
              title: '导入',
              ignoreAuth: true
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
          ignoreAuth: true,
          hideChildrenInMenu: false
        },
        component: BlankContainer,
        children: [
          {
            name: 'HtmlToDocx',
            path: 'html-to-docx',
            meta: {
              title: '富文本导出docx',
              ignoreAuth: true
            },
            component: () => import('@/views/system/feature/docx/html-to-docx.vue')
          },
          {
            name: 'HtmlToDocxPreview',
            path: 'html-to-docx-preview',
            meta: {
              title: '在线预览docx',
              ignoreAuth: true
            },
            component: () => import('@/views/system/feature/docx/docx-preview.vue')
          }
        ]
      }
    ]
  }
])
