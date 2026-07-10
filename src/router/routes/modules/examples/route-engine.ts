import { defineRoutes } from '@/router'

export default defineRoutes([
  {
    name: 'Examples',
    path: '/examples',
    meta: {
      title: '示例中心',
      ignoreAuth: true,
      menu: {
        icon: 'ep.guide',
        order: 50
      }
    },
    children: [
      {
        name: 'RouteEngineExamples',
        path: 'route-engine',
        meta: {
          title: '路由与菜单',
          ignoreAuth: true,
          icon: 'ep.menu',
          order: 10
        },
        children: [
          {
            name: 'RouteEngineOverview',
            path: 'overview',
            meta: {
              title: '引擎概览',
              ignoreAuth: true,
              icon: 'ep.monitor',
              order: 10
            },
            component: () => import('@/views/system/examples/route-engine/overview.vue')
          },
          {
            name: 'RouteEngineAccess',
            path: 'access-control',
            meta: {
              title: '登录与权限',
              ignoreAuth: true,
              icon: 'ep.lock',
              order: 20
            },
            component: () => import('@/views/system/examples/route-engine/access-control.vue')
          },
          {
            name: 'RouteEngineMenuProjection',
            path: 'menu-projection',
            meta: {
              title: '菜单投影',
              ignoreAuth: true,
              icon: 'ep.share',
              order: 30
            },
            component: () => import('@/views/system/examples/route-engine/menu-projection.vue')
          },
          {
            name: 'RouteEngineKeepAliveA',
            path: 'keep-alive-a',
            meta: {
              title: '缓存示例',
              ignoreAuth: true,
              isKeepAlive: true,
              icon: 'ep.coin',
              order: 40
            },
            component: () => import('@/views/system/examples/route-engine/keep-alive-a.vue')
          },
          {
            name: 'RouteEngineKeepAliveB',
            path: 'keep-alive-b',
            meta: {
              title: '缓存验证',
              ignoreAuth: true,
              isKeepAlive: true,
              hideInMenu: true,
              icon: 'ep.coin'
            },
            component: () => import('@/views/system/examples/route-engine/keep-alive-b.vue')
          }
        ]
      }
    ]
  }
])
