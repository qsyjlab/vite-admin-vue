import { defineExposeRoutes } from '../helper/utils'

import { RouteRecordRaw } from 'vue-router'

export type RouteModules = Record<
  string,
  {
    default: RouteRecordRaw | RouteRecordRaw[]
  }
>

const modules: RouteModules = import.meta.glob('./modules/**/*.ts', { eager: true })

// 加载路由模块
export function loadRouterModules() {
  const routeModuleList: RouteRecordRaw[] = []

  Object.keys(modules).forEach(key => {
    const m = modules[key].default

    const ml = Array.isArray(m) ? [...m] : [m]

    routeModuleList.push(...ml)
  })

  return routeModuleList
}

export const asyncRoutes = loadRouterModules()

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

console.log('rotues', routes)

debugger

export { routes as default }
