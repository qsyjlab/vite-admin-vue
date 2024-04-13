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
