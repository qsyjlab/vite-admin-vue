import { describe, expect, it } from 'vitest'
import { cloneDeep } from 'lodash-es'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createRouteEngine } from '../create-route-engine'

import type { RouteRecordRaw } from 'vue-router'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', name: 'Root', component: () => Promise.resolve({}) }]
  })
}

function page(name: string, meta: Record<string, unknown> = {}): RouteRecordRaw {
  return {
    path: `/${name.toLowerCase()}`,
    name,
    component: () => Promise.resolve({}),
    meta
  }
}

describe('createRouteEngine', () => {
  it('bootstrap 注册授权路由与 fallback，reset 移除非静态路由', async () => {
    const router = createTestRouter()
    const fallbackRoute: RouteRecordRaw = {
      path: '/:pathMatch(.*)',
      name: 'PageNotFound',
      component: () => Promise.resolve({})
    }
    const engine = createRouteEngine({
      router,
      staticRouteNames: ['Root'],
      fallbackRoute,
      loadRoutes: async () => [page('Welcome')],
      authorizeRoutes: routes => routes,
      transformRoutes: routes => routes,
      projectMenus: () => []
    })

    await engine.bootstrap({})

    expect(router.hasRoute('Welcome')).toBe(true)
    expect(router.hasRoute('PageNotFound')).toBe(true)
    expect(router.resolve('/welcome').name).toBe('Welcome')

    await engine.reset()
    expect(router.hasRoute('Welcome')).toBe(false)
    // 静态路由不会被 reset 移除
    expect(router.hasRoute('Root')).toBe(true)
  })

  it('重复 bootstrap 会清理上一轮注册的动态路由', async () => {
    const router = createTestRouter()
    let first = true
    const engine = createRouteEngine({
      router,
      staticRouteNames: ['Root'],
      loadRoutes: async () => [page(first ? 'First' : 'Second')],
      authorizeRoutes: routes => routes,
      transformRoutes: routes => routes,
      projectMenus: () => []
    })

    await engine.bootstrap({})
    expect(router.hasRoute('First')).toBe(true)

    first = false
    await engine.bootstrap({})
    expect(router.hasRoute('First')).toBe(false)
    expect(router.hasRoute('Second')).toBe(true)
  })

  it('routeNames 收集所有层级的路由 name', async () => {
    const router = createTestRouter()
    const engine = createRouteEngine({
      router,
      staticRouteNames: ['Root'],
      loadRoutes: async () => [
        {
          path: '/parent',
          name: 'Parent',
          component: () => Promise.resolve({}),
          children: [page('Child')]
        }
      ],
      authorizeRoutes: routes => routes,
      transformRoutes: routes => routes,
      projectMenus: () => []
    })

    const result = await engine.bootstrap({})
    expect(result.routeNames).toContain('Parent')
    expect(result.routeNames).toContain('Child')
  })

  it('menus 与 routes 独立：菜单过滤不应影响注册路由', async () => {
    const router = createTestRouter()
    const engine = createRouteEngine({
      router,
      staticRouteNames: ['Root'],
      loadRoutes: async () => [page('Hidden', { hideInMenu: true }), page('Visible')],
      authorizeRoutes: routes => routes,
      transformRoutes: routes => routes,
      projectMenus: routes => {
        // 模拟真实菜单投影：cloneDeep（函数按引用保留）后过滤 hideInMenu，避免污染授权树
        const cloned = cloneDeep(routes)
        return cloned.filter(route => !route.meta?.hideInMenu).map(route => ({ name: route.name }))
      }
    })

    const result = await engine.bootstrap({})
    expect(result.menus.map(menu => menu.name)).toEqual(['Visible'])
    // 被菜单隐藏的路由仍然注册，可直接导航
    expect(router.hasRoute('Hidden')).toBe(true)
  })
})
