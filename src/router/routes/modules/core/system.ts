import { defineExposeRoutes } from '@/router'
import { Layout } from '@/router/constant'

export default defineExposeRoutes([
  {
    name: 'System',
    path: '/system',
    meta: {
      title: '系统管理',
      icon: 'ep.setting',
      order: 60,
      // 角色映射模式 (ROLE) 下仅超级管理员可访问
      roles: ['super']

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
          icon: 'ep.menu',
          order: 10
        },
        component: () => import('@/views/system/system/menu/menu.vue')
      }
    ]
  }
])
