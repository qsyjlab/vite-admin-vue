/**
 *
 * @param obj
 * @returns
 */
export function readonly<T extends object>(obj: T): T {
  return new Proxy<typeof obj>(obj, {
    get(obj, key) {
      const value = Reflect.get(obj, key)
      if (typeof value === 'object') return readonly(value)

      return value
    },
    set(obj, key) {
      const value = Reflect.get(obj, key)
      if (!value) {
        console.warn(`The ${key?.toString()} is undefined`)
      } else {
        console.warn(`The ${key?.toString()} is read-only`)
      }
      return true
    }
  })
}
