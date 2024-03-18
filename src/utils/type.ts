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
export const isNull = (value: unknown): value is null => value === null
export const isSymbol = (value: unknown): value is symbol =>
  toTypeString(value) === '[object Symbol]'
export const isMap = (value: unknown): value is Map<unknown, unknown> =>
  toTypeString(value) === '[object Map]'
export const isSet = (value: unknown): value is Set<unknown> =>
  toTypeString(value) === '[object Set]'
export const isFunction = (value: unknown): value is (...args: any[]) => any =>
  !!value && typeof value === 'function'

export const isBoolean = (value: unknown) => toTypeString(value) === '[object Boolean]'
export const isRegExp = (value: unknown): value is RegExp =>
  toTypeString(value) === '[object RegExp]'

export const objectToString = Object.prototype.toString

export const extend = Object.assign

export const isFile = (value: unknown): value is File => value instanceof File

export const isBlob = (value: unknown): value is Blob => value instanceof Blob

export const isImage = (filename: string) => {
  return /\.(jpg|jpeg|png|gif|bmp|svg)$/.test(filename.toLowerCase())
}

export const isXlsx = (filename: string) => {
  return /^.+(\.xls|\.xlsx)$/.test(filename.toLowerCase())
}

export const isDocx = (filename: string) => {
  return /^.+(\.docx)$/.test(filename.toLowerCase())
}

export const isPdf = (filename: string) => {
  return /^.+(\.pdf)$/.test(filename.toLowerCase())
}
