import { generate } from '@arco-design/color'

export const useElementCssVar = (mode?: 'light' | 'dark') => {
  const el = document.documentElement

  const style = el.style

  mode = mode || 'light'

  const setElementCssVar = (color: string, mode?: 'light' | 'dark'): void => {
    let colorList: string[] = []

    if (mode === 'light') {
      colorList = generate(color, { index: 10, list: true, dark: false })
    } else {
      colorList = generate(color, { index: 10, list: true, dark: true })
      colorList.unshift(color)
    }

    // set css var
    style.setProperty('--el-color-primary', colorList[0])

    for (let index = 1; index <= 9; index++) {
      style.setProperty(`--el-color-primary-light-${index}`, colorList[index])
    }
  }
  const removeElementCssVar = () => {
    style.removeProperty('--el-color-primary')
    for (let index = 1; index <= 9; index++) {
      style.removeProperty(`--el-color-primary-light-${index}`)
    }
  }

  return {
    setElementCssVar,
    removeElementCssVar
  }
}
