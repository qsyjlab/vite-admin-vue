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
    component: () => import(/* webpackChunkName: "Welcome" */ '@/views/system/WelcomeTo.vue'),
    children: []
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: 'Dashboard',
      sort: 2,
      icon: 'icon-stopwatch'
    },
    component: () => import('@/views/system/WelcomeTo.vue'),
    children: []
  }
])
