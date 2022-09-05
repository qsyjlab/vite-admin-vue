import { defineExposeRoutes } from '@/utils'
export default defineExposeRoutes([
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      isAuth: false
    },
    component: () => import('@/views/Login/Login.vue')
  }
])
