import { mergeWith, cloneDeep } from 'lodash-es'
import { isObject } from '../type'

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
