import { loadRoutes } from '@/utils'

import { defineExposeRoutes } from '../helper'

import { createBlankContainer } from '@/layouts'
import { RouteRecordRaw } from 'vue-router'

export type RouteModules = Record<
  string,
  {
    default: RouteRecordRaw | RouteRecordRaw[]
  }
>

const modules: RouteModules = import.meta.glob('./modules/**/*.ts', { eager: true })

console.log('modules', modules)

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

export const routes = defineExposeRoutes([
  {
    path: '/',
    redirect: '/welcome',
    meta: {
      title: '主系统',
      hideInBreadcrumb: true
    }
  },
  // {
  //   path: '/',
  //   name: 'Home',

  //   meta: {
  //     title: '主系统',
  //     hideInBreadcrumb: true
  //   },
  //   component: () => import('@/layouts/basic-layout/basic-layout.vue'),
  //   children: loadRoutes(import.meta.glob('./modules/system/*.ts', { eager: true }))
  // },
  // ...asyncRoutes,
  {
    path: '/user',
    name: 'User',
    redirect: { name: 'Login' },
    meta: {
      hideInBreadcrumb: true,
      isAuth: false
    },
    component: createBlankContainer('User'),
    children: loadRoutes(import.meta.glob('./user/*.ts', { eager: true }))
  },
  {
    path: '/error',
    name: 'Error',
    meta: {
      hideInMenu: true,
      hideInBreadcrumb: true
    },
    component: createBlankContainer('Error'),
    children: loadRoutes(import.meta.glob('./error/*.ts', { eager: true }))
  },
  {
    path: '/:pathMatch(.*)',
    name: 'PageNotFound',
    component: createBlankContainer('Error')
    // redirect: { name: 'Error404' }
  }
])

console.log('routes', routes)

export { routes as default }
