import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    path: '/welcome',
    name: 'Welcome',
    meta: {
      title: 'Welcome',
      order: 10,
      icon: 'ep.home-filled',
      // hideChildrenInMenu: true,
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
          title: 'Welcome',
          icon: 'ep.home-filled',

          affixTab: true,
          // currentActiveMenu: 'Welcome',
          hideInBreadcrumb: true
        },
        component: () => import('@/views/system/WelcomeTo.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: 'Dashboard',
      icon: 'ep.stopwatch',
      hideChildrenInMenu: true
    },
    redirect: {
      name: 'DashboardIndex'
    },
    component: () => import('@/layouts/basic-layout/basic-layout.vue'),
    children: [
      {
        path: 'index',
        name: 'DashboardIndex',
        meta: {
          title: 'Dashboard',
          icon: 'ep.stopwatch',
          currentActiveMenu: 'Dashboard',
          hideInBreadcrumb: true,
          hideInMenu: true
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: []
      }
    ]
  }
])
