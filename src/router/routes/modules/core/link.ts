import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'
import config from '@/config'

export default defineExposeRoutes([
  {
    name: 'OutPage',
    path: '/out-page',
    meta: {
      title: '外部页面',
      icon: 'ep.link',
      order: 70
    },
    redirect: {
      name: 'Iframe'
    },
    component: Layout,
    children: [
      {
        name: 'OutLink',
        path: 'out-link',
        meta: {
          title: '外链',
          icon: 'ep.link',
          order: 10,
          href: config.docxLink
        }
      },
      {
        name: 'Iframe',
        path: 'iframe',
        meta: {
          isKeepAlive: true,
          title: 'iframe',
          icon: 'ep.monitor',
          order: 20
        },
        component: () => import('@/views/system/out/iframe/iframe.vue')
      },
      {
        name: 'Qiankun',
        path: '/sub-vite',
        meta: {
          isKeepAlive: true,
          title: 'Qiankun',
          icon: 'ep.connection',
          order: 30,
          hideChildrenInMenu: false
        },
        component: () => import('@/views/system/out/micro-app/qiankun.vue'),
        children: [
          {
            name: 'ReactSwc',
            path: 'react-swc/:pathMatch(.*)*',
            meta: {
              isKeepAlive: true,
              title: 'ReactSwc',
              icon: 'ep.orange',
              hideChildrenInMenu: false
            },
            component: () => import('@/views/system/out/micro-app/react-swc.vue')
          }
        ]
      }
    ]
  }
])
