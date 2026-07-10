type ThemeMode = 'light' | 'dark'

function normalizeHex(color: string) {
  const hex = color.replace('#', '')
  if (hex.length === 3) {
    return hex
      .split('')
      .map(char => char + char)
      .join('')
  }
  return hex.slice(0, 6)
}

function mixColor(color: string, target: string, weight: number) {
  const from = normalizeHex(color)
  const to = normalizeHex(target)
  const channel = (hex: string, offset: number) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16)
  const mixChannel = (offset: number) =>
    Math.round(channel(from, offset) * (1 - weight) + channel(to, offset) * weight)
      .toString(16)
      .padStart(2, '0')

  return `#${mixChannel(0)}${mixChannel(2)}${mixChannel(4)}`
}

export const useElementCssVar = () => {
  const el = document.documentElement

  const style = el.style

  const setElementCssVar = (color: string, mode: ThemeMode = 'light'): void => {
    const mixTarget = mode === 'dark' ? '#141414' : '#ffffff'

    style.setProperty('--el-color-primary', color)
    style.setProperty(
      '--el-color-primary-dark-2',
      mixColor(color, mode === 'dark' ? '#ffffff' : '#000000', 0.2)
    )

    for (let index = 1; index <= 9; index++) {
      style.setProperty(`--el-color-primary-light-${index}`, mixColor(color, mixTarget, index / 10))
    }
  }
  const removeElementCssVar = () => {
    style.removeProperty('--el-color-primary')
    for (let index = 1; index <= 9; index++) {
      style.removeProperty(`--el-color-primary-light-${index}`)
    }
    style.removeProperty('--el-color-primary-dark-2')
  }

  return {
    setElementCssVar,
    removeElementCssVar
  }
}
