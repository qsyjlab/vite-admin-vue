import { describe, expect, it, vi } from 'vitest'

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
  isObject: (v: unknown) => typeof v === 'object' && v !== null,
  cloneDeep: (v: unknown) => v
}))

import { routeConversionHandler } from '../handler'

describe('routeConversionHandler 组件函数存活验证', () => {
  it('lazy component 应保持为函数（cloneDeep 不应销毁它）', () => {
    const loader = async () => ({ default: { name: 'Demo', setup: () => null } })
    const routes = [
      {
        path: '/demo',
        name: 'Demo',
        component: loader,
        meta: { title: 'Demo' },
        children: [
          {
            path: 'detail',
            name: 'DemoDetail',
            component: loader,
            meta: { title: 'Detail' }
          }
        ]
      }
    ] as any[]

    const result = routeConversionHandler(routes)
    const parent = result[0]
    const child = parent.children[0]

    console.log('parent.component:', typeof parent.component)

    console.log('child.component:', typeof child.component)

    expect(typeof parent.component).toBe('function')
    expect(typeof child.component).toBe('function')
  })
})
