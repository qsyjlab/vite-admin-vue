import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createProSelectCacheKey,
  getProSelectCachedRequest,
  invalidateProSelectCache
} from '../pro-select-cache'

describe('pro-select-cache', () => {
  afterEach(() => invalidateProSelectCache())

  it('deduplicates requests and supports invalidation', async () => {
    invalidateProSelectCache()
    const request = vi.fn(async () => [{ label: 'A', value: 1 }])
    const key = createProSelectCacheKey('users', { keyword: 'a', page: 1 })
    await Promise.all([
      getProSelectCachedRequest(key, request, 1000),
      getProSelectCachedRequest(key, request, 1000)
    ])
    expect(request).toHaveBeenCalledTimes(1)
    await getProSelectCachedRequest(key, request, 1000)
    expect(request).toHaveBeenCalledTimes(1)
    invalidateProSelectCache('users')
    await getProSelectCachedRequest(key, request, 1000)
    expect(request).toHaveBeenCalledTimes(2)
  })

  it('isolates keyword and page parameters', async () => {
    const request = vi.fn(async () => [{ label: 'A', value: 1 }])
    const firstPage = createProSelectCacheKey('users', { keyword: 'a', page: 1 })
    const secondPage = createProSelectCacheKey('users', { keyword: 'a', page: 2 })
    const otherKeyword = createProSelectCacheKey('users', { keyword: 'b', page: 1 })

    await getProSelectCachedRequest(firstPage, request, 1000)
    await getProSelectCachedRequest(secondPage, request, 1000)
    await getProSelectCachedRequest(otherKeyword, request, 1000)

    expect(request).toHaveBeenCalledTimes(3)
  })

  it('creates stable keys for params with a different property order', () => {
    expect(createProSelectCacheKey('users', { keyword: 'a', page: 1 })).toBe(
      createProSelectCacheKey('users', { page: 1, keyword: 'a' })
    )
  })

  it('bypasses existing data when force refresh is requested', async () => {
    const request = vi.fn(async () => [{ label: 'A', value: 1 }])
    const key = createProSelectCacheKey('users', { keyword: 'a' })

    await getProSelectCachedRequest(key, request, 1000)
    await getProSelectCachedRequest(key, request, 1000, true)

    expect(request).toHaveBeenCalledTimes(2)
  })

  it('invalidates only the requested namespace', async () => {
    const usersRequest = vi.fn(async () => [{ label: 'User', value: 1 }])
    const rolesRequest = vi.fn(async () => [{ label: 'Role', value: 1 }])
    const usersKey = createProSelectCacheKey('users', {})
    const rolesKey = createProSelectCacheKey('roles', {})

    await getProSelectCachedRequest(usersKey, usersRequest, 1000)
    await getProSelectCachedRequest(rolesKey, rolesRequest, 1000)
    invalidateProSelectCache('users')
    await getProSelectCachedRequest(usersKey, usersRequest, 1000)
    await getProSelectCachedRequest(rolesKey, rolesRequest, 1000)

    expect(usersRequest).toHaveBeenCalledTimes(2)
    expect(rolesRequest).toHaveBeenCalledTimes(1)
  })
})
