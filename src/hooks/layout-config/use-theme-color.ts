import { generateThemeCluster } from '@/utils'

import { generate } from '@arco-design/color'

export const useElementCssVar = (mode?: 'light' | 'dark') => {
  const el = document.documentElement

  const style = el.style

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mode = mode || 'light'

  const setElementCssVar = (color: string, mode?: 'light' | 'dark'): void => {
    let colorList: string[] = []

    if (mode === 'light') {
      colorList = generateThemeCluster(color)
    } else {
      colorList = generate(color, { index: 10, list: true, dark: true })
      colorList.unshift(color)
    }

    // set css var
    style.setProperty('--el-color-primary', colorList[0])
    style.setProperty('--el-button-bg-color', colorList[0])
    style.setProperty('--el-button-active-bg-color', colorList[10])
    style.setProperty('--el-button-active-border-color', colorList[10])
    style.setProperty('--el-color-primary-dark-2', colorList[1])
    style.setProperty('--el-color-primary-dark-1', colorList[1])
    for (let index = 1; index <= 9; index++) {
      style.setProperty(`--el-color-primary-light-${index}`, colorList[index])
    }
  }
  const removeElementCssVar = () => {
    style.removeProperty('--el-color-primary')
    style.removeProperty('--el-button-bg-color')
    style.removeProperty('--el-button-active-bg-color')
    style.removeProperty('--el-button-active-border-color')
    style.removeProperty('--el-color-primary-dark-2')
    style.removeProperty('--el-color-primary-dark-1')
    for (let index = 1; index <= 9; index++) {
      style.removeProperty(`--el-color-primary-light-${index}`)
    }
  }

  return {
    setElementCssVar,
    removeElementCssVar
  }
}
