import { createBlankContainer } from '@/layouts'
import { defineExposeRoutes } from '@/router'

export default defineExposeRoutes([
  {
    name: 'OutPage',
    path: '/out-page',
    meta: {
      isNotAuth: true,
      sort: 7,
      title: '外部页面'
    },
    component: () => import('@/layouts/basic-layout/basic-layout.vue'),
    children: [
      {
        name: 'OutLink',
        path: 'out-link',
        meta: {
          isNotAuth: true,
          title: '外链',
          href: 'https://qsyjlab.club'
        },
        component: createBlankContainer('OutLink')
      },
      {
        name: 'Iframe',
        path: 'iframe',
        meta: {
          isNotAuth: true,
          title: 'iframe'
        },
        component: () => import('@/views/system/out/iframe/iframe.vue')
      }
    ]
  }
])
