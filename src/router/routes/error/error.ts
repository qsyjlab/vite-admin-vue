import { defineExposeRoutes } from '@/utils'

export default defineExposeRoutes([
  {
    path: '/error404',
    name: 'Error404',
    meta: {
      title: '404',
      isAuth: false
    },
    component: () => import('@/views/error/Error404.vue')
  },
  {
    path: '/error403',
    name: 'Error403',
    meta: {
      title: '403',
      isAuth: false
    },
    component: () => import('@/views/error/Error403.vue')
  }
])
