import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    path: '/welcome',
    name: 'Welcome',
    meta: {
      title: 'Welcome',
      sort: 1,
      icon: 'icon-home-filled',
      hideChildrenInMenu: true,
      hideInBreadcrumb: true,

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
          sort: 1,
          icon: 'icon-home-filled',

          affixTab: true,
          currentActiveMenu: 'Welcome'
        },
        component: () => import(/* webpackChunkName: "Welcome" */ '@/views/system/WelcomeTo.vue')
      }
    ]
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: 'Dashboard',
      sort: 2,
      icon: 'icon-stopwatch'
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
          sort: 2,
          icon: 'icon-stopwatch'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: []
      }
    ]
  }
])
