import { describe, expect, it } from 'vitest'
import { getProPathValue, normalizeProPath, setProPathValue } from '../pro-path'

describe('pro path', () => {
  it('normalizes dot and array paths', () => {
    expect(normalizeProPath('user.profile.name')).toEqual(['user', 'profile', 'name'])
    expect(normalizeProPath(['items', 0, 'name'])).toEqual(['items', 0, 'name'])
  })

  it('reads nested object and array values', () => {
    const source = {
      user: { profile: { name: 'Ada' } },
      items: [{ id: 7 }]
    }

    expect(getProPathValue(source, 'user.profile.name')).toBe('Ada')
    expect(getProPathValue(source, ['items', 0, 'id'])).toBe(7)
    expect(getProPathValue(source, 'user.missing.name')).toBeUndefined()
  })

  it('writes nested values and creates missing containers', () => {
    const target: Record<string, unknown> = {}

    setProPathValue(target, 'user.profile.name', 'Ada')
    setProPathValue(target, ['items', 0, 'id'], 7)

    expect(target).toEqual({
      user: { profile: { name: 'Ada' } },
      items: [{ id: 7 }]
    })
  })
})
