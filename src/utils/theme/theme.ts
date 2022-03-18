/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 16:31:07
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-18 16:33:34
 * @FilePath: \vite-admin-vue\src\utils\theme\theme.ts
 */

/**
 * 获取色阶
 * @param themeColor
 * @returns
 */
export const getThemeCluster = (themeColor: string): string[] => {
  const theme = themeColor.replace(/#/, '')

  const tintColor = (color: string, tint: number): string => {
    let red: number = parseInt(color.slice(0, 2), 16)
    let green: number = parseInt(color.slice(2, 4), 16)
    let blue: number = parseInt(color.slice(4, 6), 16)

    if (tint === 0) {
      // when primary color is in its rgb space
      return [red, green, blue].join(',')
    } else {
      red += Math.round(tint * (255 - red))
      green += Math.round(tint * (255 - green))
      blue += Math.round(tint * (255 - blue))

      return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`
    }
  }

  const shadeColor = (color: any, shade: any): any => {
    let red: number = parseInt(color.slice(0, 2), 16)
    let green: number = parseInt(color.slice(2, 4), 16)
    let blue: number = parseInt(color.slice(4, 6), 16)

    red = Math.round((1 - shade) * red)
    green = Math.round((1 - shade) * green)
    blue = Math.round((1 - shade) * blue)

    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`
  }

  const clusters = [themeColor]
  for (let i = 1; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
  }
  clusters.push(shadeColor(theme, 0.1))
  return clusters
}
