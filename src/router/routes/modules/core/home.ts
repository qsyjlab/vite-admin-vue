import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    path: '/welcome',
    name: 'Welcome',
    meta: {
      title: '工作台',
      order: 10,
      icon: 'ep.home-filled',
      hideChildrenInMenu: true,
      hideInTab: true
    },
    redirect: {
      name: 'WelcomeIndex'
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'WelcomeIndex',
        meta: {
          title: '工作台',
          icon: 'ep.home-filled',
          order: 10,
          affixTab: true,
          // currentActiveMenu: 'Welcome',
          hideInBreadcrumb: true
        },
        component: () => import('@/views/system/WelcomeTo.vue')
      }
    ]
  }
])
