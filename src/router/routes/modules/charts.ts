import { defineExposeRoutes } from '@/router'
// import { createBlankContainer } from '@/layouts'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'Charts',
    path: '/charts',
    meta: {
      title: '图表',
      order: 20,
      icon: 'ep.document'
    },
    redirect: { name: 'Echarts' },
    component: Layout,
    children: [
      {
        name: 'Echarts',
        path: 'echarts',
        meta: {
          title: 'echarts'
        },
        component: () => import('@/views/system/charts/echarts/echarts.vue')
      }
    ]
  }
])
