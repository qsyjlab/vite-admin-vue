import { isEmptyValue } from './is'

type Many<T> = T | T[]

/**
 * @example
 * ensureArray(0) => [0]
 * ensureArray([0]) => [1]
 * ensureArray('') => []
 */
export function ensureArray<T = any>(arr: Many<T>): T[] {
  if (isEmptyValue(arr)) return []
  return Array.isArray(arr) ? arr : [arr]
}

export const unique = <T>(arr: T[]) => [...new Set(arr)]

export function groupByToMap<T, K>(arr: T[], key: ((item: T) => any) | keyof T): Map<K, T[]> {
  const map = new Map<K, T[]>()

  arr.forEach(item => {
    const itemKey = typeof key === 'function' ? key(item) : item[key]
    if (!map.has(itemKey)) {
      map.set(itemKey, [])
    }
    const collection: T[] = map.get(itemKey)!
    collection.push(item)
  })

  return map
}

/**
 * 对象数组去重
 *
 * @example
 * [
 *    { id: 1, name: 'Alice', age: 25 },
 *    { id: 2, name: 'Bob', age: 30 },
 *    { id: 2, name: 'Bob', age: 30 },
 * ]
 *
 * removeDuplicatesBy(array, item => item.id);
 * removeDuplicatesBy(array, 'id');
 */
export function removeArrayDuplicatesBy<T>(array: T[], key: ((item: T) => any) | keyof T) {
  const seen = new Set()
  return array.filter(item => {
    const realKey = typeof key !== 'function' ? item[key] : key(item)
    if (seen.has(realKey)) {
      return false
    } else {
      seen.add(realKey)
      return true
    }
  })
}

export function forEachMap<K, V>(map: Map<K, V>, callback?: (key: K, value: V) => void) {
  for (const [key, value] of map.entries()) {
    callback?.(key, value)
  }
}
