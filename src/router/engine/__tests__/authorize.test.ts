import { describe, expect, it } from 'vitest'
import { PermissionModeEnum } from '@/enum'
import { filterByRole, resolvePermissionRoutes } from '../authorize'

import type { RouteRecordRaw } from 'vue-router'

function route(partial: Partial<RouteRecordRaw> & { name: string }): RouteRecordRaw {
  return { path: `/${partial.name}`, component: () => Promise.resolve({}), ...partial }
}

describe('filterByRole', () => {
  it('父路由 roles 不匹配时整棵子树移除', () => {
    const routes = [
      route({
        name: 'Admin',
        meta: { roles: ['super'] },
        children: [route({ name: 'AdminChild' })]
      }),
      route({ name: 'Public' })
    ]

    const result = filterByRole(routes, ['editor'])
    expect(result.map(item => item.name)).toEqual(['Public'])
  })

  it('子路由 roles 不匹配只移除该子路由', () => {
    const routes = [
      route({
        name: 'Parent',
        children: [
          route({ name: 'SuperOnly', meta: { roles: ['super'] } }),
          route({ name: 'Everyone' })
        ]
      })
    ]

    const result = filterByRole(routes, ['editor'])
    expect(result[0].children?.map(item => item.name)).toEqual(['Everyone'])
  })

  it('ignoreAuth 路由不受角色过滤影响', () => {
    const routes = [route({ name: 'Open', meta: { ignoreAuth: true, roles: ['super'] } })]

    expect(filterByRole(routes, []).map(item => item.name)).toEqual(['Open'])
  })

  it('父级角色匹配但子路由无 roles 声明时子路由保留', () => {
    const routes = [
      route({
        name: 'SuperArea',
        meta: { roles: ['super'] },
        children: [route({ name: 'Inner' })]
      })
    ]

    const result = filterByRole(routes, ['super'])
    expect(result[0].children?.map(item => item.name)).toEqual(['Inner'])
  })
})

describe('resolvePermissionRoutes', () => {
  const frontRoutes = [
    route({ name: 'Welcome', meta: { ignoreAuth: true } }),
    route({ name: 'Charts' }),
    route({ name: 'About', meta: { ignoreAuth: true } })
  ]

  it('ROUTE_MAPPING 模式按路由 name 与 permissions 求交集', () => {
    const result = resolvePermissionRoutes(frontRoutes, {
      permissionMode: PermissionModeEnum.ROUTE_MAPPING,
      permissions: ['Charts'],
      roles: []
    })

    expect(result.map(item => item.name)).toEqual(['Welcome', 'Charts', 'About'])
  })

  it('ROUTE_MAPPING 模式无权限的路由被剔除', () => {
    const result = resolvePermissionRoutes([route({ name: 'Secret' }), route({ name: 'Charts' })], {
      permissionMode: PermissionModeEnum.ROUTE_MAPPING,
      permissions: ['Charts'],
      roles: []
    })

    expect(result.map(item => item.name)).toEqual(['Charts'])
  })

  it('BACKED 模式不修改调用方传入的后端数据', () => {
    const backendRoutes = [route({ name: 'BackendHome', component: 'LAYOUT' as unknown as never })]
    resolvePermissionRoutes([], {
      permissionMode: PermissionModeEnum.BACKED,
      permissions: [],
      roles: [],
      backendRoutes
    })

    // transformObjToRoute 会把一级业务路由包上 Layout 并改名 Parent，原始数据必须保持原样
    expect(backendRoutes[0].name).toBe('BackendHome')
    expect(backendRoutes[0].component).toBe('LAYOUT')
  })

  it('BACKED 模式转换结果包含 Layout 包装与子路由', () => {
    const result = resolvePermissionRoutes([], {
      permissionMode: PermissionModeEnum.BACKED,
      permissions: [],
      roles: [],
      backendRoutes: [
        route({
          name: 'BackendHome',
          path: '/backend-home',
          component: '/system/charts/echarts/echarts' as unknown as never
        })
      ]
    })

    const wrapper = result[0]
    expect(wrapper.name).toBe('BackendHomeParent')
    expect(wrapper.path).toBe('')
    expect(wrapper.meta?.single).toBe(true)
    expect(wrapper.children?.[0].name).toBe('BackendHome')
    // 字符串组件被替换为动态 import 的 loader 函数
    expect(typeof wrapper.children?.[0].component).toBe('function')
  })
})
