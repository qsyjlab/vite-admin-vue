import { defineExposeRoutes } from '@/router'
// import { createBlankContainer } from '@/layouts'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Charts',
    path: '/charts',
    meta: {
      title: '图表',
      sort: 4,
      icon: 'ep.document'
    },

    redirect: { name: 'Echarts' },
    component: Layout,
    children: [
      {
        name: 'Echarts',
        path: '/echarts',
        meta: {
          title: 'echarts',
          sort: 4
        },
        component: () => import('@/views/system/charts/echarts/echarts.vue')
      }
    ]
  }
])
