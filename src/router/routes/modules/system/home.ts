import BasicLayout from '@/layouts/basic-layout/basic-layout.vue'
import { defineExposeRoutes } from '@/router'

export default defineExposeRoutes([
  {
    path: '/welcome',
    name: 'Welcome',
    meta: {
      title: 'Welcome',
      sort: 1,
      icon: 'icon-home-filled'
    },
    redirect: {
      name: 'WelcomeIndex'
    },
    component: () => import('@/layouts/basic-layout/basic-layout.vue'),
    children: [
      {
        path: '/welcome',
        name: 'WelcomeIndex',
        meta: {
          title: 'Welcome',
          sort: 1,
          icon: 'icon-home-filled'
        },
        component: () => import(/* webpackChunkName: "Welcome" */ '@/views/system/WelcomeTo.vue'),
        children: []
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
    component: () => import('@/layouts/basic-layout/basic-layout.vue'),
    children: [
      {
        path: '/',
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
