import { loadRoutes, defineExposeRoutes } from '@/utils'
import { createBlankContainer } from '@/layouts'

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
