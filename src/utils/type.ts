export const toTypeString = (value: unknown): string => Object.prototype.toString.call(value)

export const toRawType = (value: unknown): string => {
  return toTypeString(value).slice(8, -1)
}
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const isPlainObject = (value: unknown) => toTypeString(value) === '[object Object]'
export const isArray = Array.isArray
export const isDate = (value: unknown) => toTypeString(value) === '[object Date]'
export const isString = (value: unknown) => toTypeString(value) === '[object String]'
export const isUndefined = (value: unknown) => toTypeString(value) === '[object Undefined]'
export const isNull = (value: unknown) => toTypeString(value) === '[object Null]'
export const isSymbol = (value: unknown) => toTypeString(value) === '[object Symbol]'
export const isMap = (value: unknown) => toTypeString(value) === '[object Map]'
export const isSet = (value: unknown) => toTypeString(value) === '[object Set]'
export const isFunction = (value: unknown) => toTypeString(value) === '[object Function]'
export const isBoolean = (value: unknown) => toTypeString(value) === '[object Boolean]'
export const isRegExp = (value: unknown) => toTypeString(value) === '[object RegExp]'
export const toString = (value: unknown) => toTypeString(value)
export const objectToString = Object.prototype.toString

export const extend = Object.assign
