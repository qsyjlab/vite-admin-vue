import { mergeWith, cloneDeep } from 'lodash-es'
import { isObject } from '../type'
import { isEmpty } from './is'
import { ensureArray } from './array'

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

// 检查某些属性以外的值为空
export function hasOnlyPropsWithValue<T extends object>(
  obj: T,
  propToCheck: keyof T | (keyof T)[]
) {
  let hasValue = false

  const props = ensureArray(propToCheck)

  for (const key in obj) {
    if (Reflect.has(obj, key)) {
      if (props.includes(key)) {
        hasValue = !isEmpty(obj[key])
      } else if (!isEmpty(obj[key])) {
        return false
      }
    }
  }

  return hasValue
}
