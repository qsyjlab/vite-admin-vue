import { defineExposeRoutes } from '@/router'
import { Layout, BlankContainer } from '@/router/constant'
import config from '@/config'

export default defineExposeRoutes([
  {
    name: 'OutPage',
    path: '/out-page',
    meta: {
      title: '外部页面',
      icon: 'ep.link'
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
          href: config.docxLink
        },
        component: BlankContainer
      },
      {
        name: 'Iframe',
        path: 'iframe',
        meta: {
          isKeepAlive: true,

          title: 'iframe'
        },
        component: () => import('@/views/system/out/iframe/iframe.vue')
      },
      {
        name: 'Qiankun',
        path: '/sub-vite',
        meta: {
          isKeepAlive: true,
          ignoreAuth: true,
          title: 'Qiankun',
          hideChildrenInMenu: false
        },
        component: () => import('@/views/system/out/micro-app/qiankun.vue'),
        children: [
          {
            name: 'ReactSwc',
            path: 'react-swc/:pathMatch(.*)*',
            meta: {
              isKeepAlive: true,
              ignoreAuth: true,
              title: 'ReactSwc',
              hideChildrenInMenu: false
            },
            component: () => import('@/views/system/out/micro-app/react-swc.vue'),
            children: []
          }
        ]
      }
    ]
  }
])
