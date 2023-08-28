export const toTypeString = (value: unknown): string => Object.prototype.toString.call(value)

export const toRawType = (value: unknown): string => {
  return toTypeString(value).slice(8, -1)
}
export const isObject = (val: unknown): val is object => val !== null && typeof val === 'object'

export const isPlainObject = (value: unknown): value is Record<string | number | symbol, unknown> =>
  toTypeString(value) === '[object Object]'
export const isArray = Array.isArray
export const isDate = (value: unknown): value is Date => toTypeString(value) === '[object Date]'
export const isString = (value: unknown): value is string =>
  toTypeString(value) === '[object String]'
export const isUndefined = (value: unknown): value is undefined =>
  toTypeString(value) === '[object Undefined]'
export const isNull = (value: unknown): value is null => toTypeString(value) === '[object Null]'
export const isSymbol = (value: unknown): value is symbol =>
  toTypeString(value) === '[object Symbol]'
export const isMap = (value: unknown): value is Map<unknown, unknown> =>
  toTypeString(value) === '[object Map]'
export const isSet = (value: unknown): value is Set<unknown> =>
  toTypeString(value) === '[object Set]'
export const isFunction = (value: unknown) => toTypeString(value) === '[object Function]'
export const isBoolean = (value: unknown) => toTypeString(value) === '[object Boolean]'
export const isRegExp = (value: unknown): value is RegExp =>
  toTypeString(value) === '[object RegExp]'

export const objectToString = Object.prototype.toString

export const extend = Object.assign
