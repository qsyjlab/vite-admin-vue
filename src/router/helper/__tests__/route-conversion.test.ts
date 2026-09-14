import { describe, expect, it, vi } from 'vitest'

// handler.ts 从 @/utils 桶文件引入 pipe/treeMap，桶文件会连带引入浏览器依赖
// （jsencrypt/docx-preview 等），这里仅替换路由转换所需的纯函数。
vi.mock('@/utils', () => ({
  pipe:
    (...fns: ((...args: any[]) => any[])[]) =>
    (result: any) =>
      fns.reduce((acc, fn) => fn(acc), result),
  treeMap: (tree: any[], options: any) => {
    const walk = (nodes: any[]): any[] =>
      nodes.map(node => {
        const converted = options.conversion(node)
        if (node.children?.length) converted.children = walk(node.children)
        return converted
      })
    return walk(tree)
  },
  isFunction: (v: unknown) => typeof v === 'function',
  isObject: (v: unknown) => typeof v === 'object' && v !== null
}))

import { routeConversionHandler } from '../handler'

function makeRoutes() {
  return [
    {
      path: '/demo',
      name: 'Demo',
      component: async () => ({ default: { name: 'Demo', setup: () => null } }),
      meta: { menu: { title: '菜单标题' } },
      children: [
        {
          path: 'detail',
          name: 'DemoDetail',
          component: async () => ({ default: { name: 'DemoDetail', setup: () => null } }),
          meta: { title: 'Detail' }
        }
      ]
    }
  ] as any[]
}

describe('routeConversionHandler', () => {
  it('扁平化后 lazy component 保持为函数引用（cloneDeep 按引用保留函数）', () => {
    const result = routeConversionHandler(makeRoutes())
    const parent = result[0]
    const child = parent.children[0]

    expect(typeof parent.component).toBe('function')
    expect(typeof child.component).toBe('function')
  })

  it('子路由路径被扁平化为绝对路径', () => {
    const result = routeConversionHandler(makeRoutes())

    expect(result[0].children[0].path).toBe('/demo/detail')
  })

  it('自动 redirect 指向第一个子路由', () => {
    const result = routeConversionHandler(makeRoutes())

    expect(result[0].redirect).toEqual({ path: '/demo/detail' })
  })

  it('meta.menu 覆盖字段归一化到注册路由的 meta 上', () => {
    const result = routeConversionHandler(makeRoutes())

    expect(result[0].meta.title).toBe('菜单标题')
  })

  it('仅含动态参数子路由的父路由不设置自动 redirect', () => {
    const routes = [
      {
        path: '/tabs',
        name: 'Tabs',
        component: async () => ({ default: { setup: () => null } }),
        meta: {},
        children: [
          {
            path: 'detail/:id',
            name: 'TabsDetail',
            component: async () => ({ default: { setup: () => null } }),
            meta: { hideInMenu: true }
          }
        ]
      }
    ] as any[]

    const result = routeConversionHandler(routes)
    expect(result[0].redirect).toBeUndefined()
  })
})
