import { generateThemeCluster } from '@/utils'

export const useElementCssVar = () => {
  const el = document.documentElement

  const style = el.style

  const setElementCssVar = (color: string): void => {
    let colorList: string[] = []

    colorList = generateThemeCluster(color)
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
