import { defineExposeRoutes } from '@/router'
import { createBlankContainer } from '@/layouts'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'System',
    path: '/system',
    meta: {
      title: '系统管理',
      sort: 3,
      icon: 'icon-setting',
      isNotAuth: true
      // hideChildrenInMenu: true
    },
    redirect: { name: 'SystemMenu' },
    component: Layout,
    children: [
      {
        name: 'SystemMenu',
        path: 'menu',
        meta: {
          title: '菜单管理',
          icon: 'icon-timer',
          isNotAuth: false
        },
        component: () => import('@/views/system/system/menu/menu.vue')
      }
    ]
  }
])
