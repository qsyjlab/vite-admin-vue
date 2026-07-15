import { describe, expect, it } from 'vitest'
import { getBackendMenusByUsername, mockUsers } from '../auth'

describe('mock auth permissions', () => {
  it('keeps administrator route-mapping permissions aligned with backend menus', () => {
    const administrator = mockUsers.find(user => user.username === 'admin')!
    const backendRouteNames = collectRouteNames(getBackendMenusByUsername('admin'))

    expect(administrator.permissions).toEqual(expect.arrayContaining(backendRouteNames))
  })

  it('grants component examples to the editor role', () => {
    const editor = mockUsers.find(user => user.username === 'editor')!

    expect(editor.permissions).toEqual(
      expect.arrayContaining(['ProQueryFilterDemo', 'ProResultDemo', 'ProCheckCardDemo'])
    )
  })
})

function collectRouteNames(routes: Array<{ name?: string; children?: unknown[] }>): string[] {
  return routes.flatMap(route => [
    ...(route.name ? [route.name] : []),
    ...collectRouteNames((route.children ?? []) as Array<{ name?: string; children?: unknown[] }>)
  ])
}
