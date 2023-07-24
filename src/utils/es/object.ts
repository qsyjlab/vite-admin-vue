import { mergeWith, cloneDeep, unionWith, isEqual } from 'lodash-es'
import { isArray, isObject } from '../type'

export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  target: T,
  source: U
): T & U {
  return mergeWith(cloneDeep(target), source, (objValue, srcValue) => {
    if (isObject(objValue) && isObject(srcValue)) {
      return mergeWith(cloneDeep(objValue), srcValue)
    }
  })
}

// , (prevValue, nextValue) => {
//   // 如果是数组，合并数组(去重) If it is an array, merge the array (remove duplicates)
//   return isArray(prevValue) ? unionWith(prevValue, nextValue, isEqual) : undefined
// }
