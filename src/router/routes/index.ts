import { loadRoutes, defineExposeRoutes } from '@/utils'
import { createBlankContainer } from '@/layouts'
// import { loadRouterModules } from '../helper'
import { RouteRecordRaw } from 'vue-router'

export type RouteModules = Record<
  string,
  {
    default: RouteRecordRaw | RouteRecordRaw[]
  }
>

// 加载路由模块
export function loadRouterModules() {
  const modules: RouteModules = import.meta.glob('../routes/**/*.ts', { eager: true })

  const routeModuleList: RouteRecordRaw[] = []

  Object.keys(modules).forEach(key => {
    const m = modules[key].default

    const ml = Array.isArray(m) ? [...m] : [m]

    routeModuleList.push(...ml)
  })

  return routeModuleList
}

export const asyncRoutes = loadRouterModules()

console.log('初始化', asyncRoutes)

export const routes = defineExposeRoutes([
  {
    path: '/',
    redirect: { name: 'Home' },
    meta: {
      title: '主系统',
      hideInBreadcrumb: true
    }
  },
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'Welcome' },
    meta: {
      title: '主系统',
      hideInBreadcrumb: true
    },
    component: () => import('@/layouts/BasicLayout/BasicLayout.vue'),
    children: loadRoutes(import.meta.globEager('./system/*.ts'))
  },
  {
    path: '/user',
    name: 'User',
    redirect: { name: 'Login' },
    meta: {
      hideInBreadcrumb: true,
      isAuth: false
    },
    component: createBlankContainer('User'),
    children: loadRoutes(import.meta.globEager('./user/*.ts'))
  },
  {
    path: '/Error',
    name: 'Error',
    meta: {
      hideInMenu: true,
      hideInBreadcrumb: true
    },
    component: createBlankContainer('Error'),
    children: loadRoutes(import.meta.globEager('./error/*.ts'))
  },
  {
    path: '/:pathMatch(.*)',
    redirect: { name: 'Error404' }
  }
])

export { routes as default }
