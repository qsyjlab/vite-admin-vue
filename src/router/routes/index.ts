import { defineExposeRoutes } from '../helper/utils'

import { RouteRecordRaw } from 'vue-router'

export const pageError = {
  path: '/:pathMatch(.*)',
  name: 'PageNotFound',
  component: () => import('@/views/error/error-404.vue')
}

const loginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  meta: {
    title: '登录',
    isAuth: false
  },
  component: () => import('@/views/Login/Login.vue')
}

const error403: RouteRecordRaw = {
  path: '/error403',
  name: 'Error403',
  meta: {
    title: '403'
  },
  component: () => import('@/views/error/error-403.vue')
}

const error404: RouteRecordRaw = {
  path: '/error404',
  name: 'Error404',
  meta: {
    title: '404'
  },
  component: () => import('@/views/error/error-404.vue')
}

export const routes = defineExposeRoutes([
  {
    path: '/',
    redirect: '/welcome',
    meta: {
      title: '主系统',
      hideInBreadcrumb: true
    }
  },
  loginRoute,
  error403,
  error404,
  pageError
])

export default routes

export * from './async'
