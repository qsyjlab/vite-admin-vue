import { defineExposeRoutes } from '@/utils'
import { createBlankContainer } from '@/layouts'

export default defineExposeRoutes([
  {
    name: 'Menu1',
    path: '/menu1',
    meta: {
      title: '一级菜单',
      isNotAuth: true,
      icon: 'icon-list'
    },
    component: createBlankContainer('Menu1'),
    children: [
      {
        name: 'Menu2',
        path: 'menu2',
        meta: {
          title: '二级菜单',
          isNotAuth: true,
          icon: 'icon-list'
        },
        component: () => import('@/views/system/components/Upload.vue')
        // () => import('@/views/system/components/Upload.vue')
      },
      {
        name: 'Menu3',
        path: 'menu3',
        meta: {
          title: '二级菜单',
          isNotAuth: true,
          icon: 'icon-list'
        },
        component: () => import('@/views/system/components/Upload.vue')
        // () => import('@/views/system/components/Upload.vue')
      },
      {
        name: 'Menu4',
        path: 'menu4',
        meta: {
          title: '一级菜单',
          isNotAuth: true,
          icon: 'icon-list'
        },
        component: createBlankContainer('Menu3'),
        children: [
          {
            name: 'Menu5',
            path: 'menu5',
            meta: {
              title: '三级菜单',
              isNotAuth: true,
              icon: 'icon-list'
            },
            component: () => import('@/views/system/components/Upload.vue')
            // () => import('@/views/system/components/Upload.vue')
          },
          {
            name: 'Menu6',
            path: 'menu6',
            meta: {
              title: '三级菜单',
              isNotAuth: true,
              icon: 'icon-list'
            },
            component: () => import('@/views/system/components/Upload.vue')
            // () => import('@/views/system/components/Upload.vue')
          }
        ]
      }
    ]
    //
  }
])
