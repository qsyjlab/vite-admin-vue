/*
 * @Description: proxy 代理
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 13:57:32
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-17 13:58:51
 * @FilePath: \vite-admin-vue\src\utils\es\proxy.ts
 */

/**
 * @param {T extends object } obj 目标对象
 * @param deep 是否代理深层  default:true
 * @returns {T extends object}
 */
export function isReadonly<T extends object>(obj: T, deep = true): T {
  if (deep) {
    if (typeof obj === 'object') {
      if (obj instanceof Array) {
        obj.forEach((item, index) => {
          if (typeof item === 'object') {
            obj[index] = isReadonly(item, deep)
          }
        })
      } else {
        for (const key in obj) {
          const item = obj[key]
          if (typeof item === 'object') {
            obj[key] = isReadonly(item as unknown as object, deep) as any
          }
        }
      }
    }
  }

  return new Proxy<typeof obj>(obj, {
    get(obj, key) {
      const _key = key as keyof typeof obj
      return obj[_key]
    },
    set(obj, key) {
      console.warn(`The ${key?.toString()} is read-only`)
      return true
    }
  })
}
