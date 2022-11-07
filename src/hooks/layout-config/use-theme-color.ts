/**
 * 更新 element primary 配色
 * @param colorList
 */
export const updateElementCssVar = (colorList: string[]): void => {
  // document.documentElement is global
  const el = document.documentElement
  // set css var
  el.style.setProperty('--el-color-primary', colorList[0])
  el.style.setProperty('--el-button-bg-color', colorList[0])
  el.style.setProperty('--el-button-active-bg-color', colorList[10])
  el.style.setProperty('--el-button-active-border-color', colorList[10])
  el.style.setProperty('--el-color-primary-dark-2', colorList[1])
  el.style.setProperty('--el-color-primary-dark-1', colorList[1])
  for (let index = 1; index <= 9; index++) {
    el.style.setProperty(`--el-color-primary-light-${index}`, colorList[index])
  }
}
