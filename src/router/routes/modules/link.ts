import { defineExposeRoutes } from '@/router'
import { Layout, BlankContainer } from '@/router/constant'

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
          href: 'https://qsyjlab.club'
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
      }
    ]
  }
])
