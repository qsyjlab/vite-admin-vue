/**
 * @example
 * capitalize => Capitalize
 */
export function capitalize(str: string) {
  // 检查传入字符串是否有效
  if (!str || typeof str !== 'string') return str

  // 将字符串的首字母转换为大写，然后与剩余部分拼接
  return str.charAt(0).toUpperCase() + str.slice(1)
}
