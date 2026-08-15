interface ProSelectCacheEntry<TOption> {
  data?: TOption[]
  expiresAt: number
  promise?: Promise<TOption[]>
}

const cache = new Map<string, ProSelectCacheEntry<unknown>>()

export function createProSelectCacheKey(namespace: string, params: object) {
  return `${namespace}:${stableStringify(params)}`
}

export function getProSelectCachedRequest<TOption>(
  key: string,
  request: () => Promise<TOption[]>,
  ttl: number,
  force = false
) {
  const current = cache.get(key) as ProSelectCacheEntry<TOption> | undefined
  if (!force && current?.data && current.expiresAt > Date.now())
    return Promise.resolve([...current.data])
  if (!force && current?.promise) return current.promise

  const promise = request()
    .then(data => {
      cache.set(key, { data: [...data], expiresAt: Date.now() + Math.max(0, ttl) })
      return data
    })
    .catch(error => {
      cache.delete(key)
      throw error
    })
  cache.set(key, { ...current, expiresAt: current?.expiresAt ?? 0, promise })
  return promise
}

export function invalidateProSelectCache(namespace?: string) {
  if (!namespace) return cache.clear()
  for (const key of cache.keys()) if (key.startsWith(`${namespace}:`)) cache.delete(key)
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}
