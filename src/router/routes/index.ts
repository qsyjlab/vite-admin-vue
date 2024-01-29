import { defineExposeRoutes } from '../helper/utils'
import { LOGIN_NAME, LOGIN_PATH, REDIRECT_NAME, Layout, PAGE_NOT_FOUND } from '../constant'

import type { RouteRecordRaw } from 'vue-router'

export const pageError: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  name: PAGE_NOT_FOUND,
  component: () => import('@/views/error/error-404.vue')
}

const loginRoute: RouteRecordRaw = {
  path: LOGIN_PATH,
  name: LOGIN_NAME,
  meta: {
    title: '登录',
    isAuth: false
  },
  component: () => import('@/views/login/login.vue')
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

const root: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: '/welcome',
  meta: {
    title: '主系统',
    hideInBreadcrumb: true
  }
}

export const redirectRoute: RouteRecordRaw = {
  path: '/redirect',
  component: Layout,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
    ignoreKeepAlive: true
  },
  children: [
    {
      path: '/redirect/:path(.*)/:_redirect_type(.*)/:_origin_params(.*)?',
      name: REDIRECT_NAME,
      component: () => import('@/views/redirect/redirect.vue'),
      meta: {
        title: REDIRECT_NAME,
        ignoreKeepAlive: true,
        hideBreadcrumb: true
      }
    }
  ]
}

export const routes = defineExposeRoutes([
  root,
  loginRoute,
  error403,
  error404,
  pageError,
  redirectRoute
])

function getRouteNames(routes: RouteRecordRaw[], names: string[] = []) {
  routes.forEach(item => {
    names.push(item.name as string)
    getRouteNames(item.children || [], names)
  })

  return names
}

// 静态路由名单
export const STATIC_ROUTE_NAME_LIST = getRouteNames(routes)

// 白名单
export const WHITE_NAME_LIST = [LOGIN_NAME]

export default routes

export * from './async'
