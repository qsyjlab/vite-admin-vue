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
      icon: 'ep.trend-charts',
      hideChildrenInMenu: false
    },
    redirect: { name: 'Echarts' },
    component: Layout,
    children: [
      {
        name: 'Echarts',
        path: 'echarts',
        meta: {
          title: 'ECharts',
          icon: 'ep.data-line',
          order: 10
        },
        component: () => import('@/views/system/charts/echarts/echarts.vue')
      }
    ]
  }
])
