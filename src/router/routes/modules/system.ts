import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'System',
    path: '/system',
    meta: {
      title: '系统管理',
      sort: 3,
      icon: 'icon-setting'

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
          icon: 'icon-timer'
        },
        component: () => import('@/views/system/system/menu/menu.vue')
      }
    ]
  }
])
