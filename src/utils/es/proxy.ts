/*
 * @Description: proxy 代理
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 13:57:32
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 14:19:36
 * @FilePath: \vite-admin-vue\src\utils\es\proxy.ts
 */

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
