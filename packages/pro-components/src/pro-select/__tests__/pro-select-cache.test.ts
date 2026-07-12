import { describe, expect, it, vi } from 'vitest'
import {
  createProSelectCacheKey,
  getProSelectCachedRequest,
  invalidateProSelectCache
} from '../pro-select-cache'

describe('pro-select-cache', () => {
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
})
