export function isHexColor(hex) {
  const regExp = /^#(?:[A-Fa-f0-9]{3}){1,2}$|^#(?:[A-Fa-f0-9]{4}){1,2}$/
  return regExp.test(hex)
}

/**
 * hex 转为 rgba
 */
export function convertHexToRgba(hex: string, alpha = 1) {
  if (!isHexColor(hex)) return hex
  return `rgba(${convertHexToRgbNumber(hex)?.join(',')},${alpha})`
}

export function convertHexToRgbNumber(hex: string) {
  // 移除开头的 # 号，如果有的话
  hex = hex.replace(/^#/, '')

  // 处理三位数的十六进制值，例如 #03F 变成 #0033FF
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(function (char) {
        return char + char
      })
      .join('')
  }

  // 将十六进制转换为 RGB 数值
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return [r, g, b]
}
