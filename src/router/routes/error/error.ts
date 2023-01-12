import { defineExposeRoutes } from '@/router'

export default defineExposeRoutes([
  {
    path: '/error403',
    name: 'Error403',
    meta: {
      title: '403'
    },
    component: () => import('@/views/error/error-403.vue')
  },
  {
    path: '/error404',
    name: 'Error404',
    meta: {
      title: '404'
    },
    component: () => import('@/views/error/error-404.vue')
  }
])
