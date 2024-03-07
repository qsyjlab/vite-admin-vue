import { CSSProperties } from 'vue'
import { camelize } from 'vue'
import { AlignmentType, UnderlineType, ShadingType } from 'docx'
import { parseStringStyle } from '../element'

const styleTransformMap = {
  color: {
    property: 'color',
    handler: value => {
      //  dom 元素会将 hex 转为 rgb 需要手动转回来
      return rgbToHexColor(value)
    }
  },
  backgroundColor: {
    property: 'shading',
    handler: value => {
      return {
        type: ShadingType.SOLID,
        color: rgbToHexColor(value),
        fill: rgbToHexColor(value)
      }
    }
  },

  textDecoration: {
    property: 'underline',
    handler: (value, style) => {
      return {
        type: UnderlineType.SINGLE,
        color: style.color ? rgbToHexColor(style.color) : undefined
      }
    }
  },

  /**
   * @default
   *
   *  默认字号小四
   */
  fontSize: {
    property: 'size',
    handler: value => {
      return convertFontSize(value)
    }
  },
  textIndent: {
    /**
     * @default
     * 默认处理 pt
     * Twips 单位
     */
    property: 'indent',
    handler: (value, style) => {
      const fontSize = convertToNumber(style.fontSize)
      const em = convertToNumber(value)
      return {
        firstLine: convertPtToTwips(fontSize * em)
      }
    }
  },
  textAlign: {
    property: 'alignment',
    handler: value => {
      if (value === 'center') {
        return AlignmentType.CENTER
      }

      if (value === 'right') {
        return AlignmentType.RIGHT
      }
      return AlignmentType.LEFT
    }
  },
  fontWeight: {
    property: 'bold',
    handler: value => !!value
  },
  fontFamily: {
    property: 'font',
    handler: value => {
      return value
    }
  },
  lineHeight: {
    // convertFontSize
    property: 'lineSpacing',
    handler: value => {
      if (!value) return
      return convertToNumber(value) * 20
    }
  }
}

export function cssStylesToAttrs(style: CSSProperties): any {
  const attrs: any = {}
  Object.keys(style).forEach(key => {
    const _key = camelize(key)

    const value = style[key]
    const config = styleTransformMap[_key]

    if (config) {
      attrs[config.property] = config.handler(value, style)
      return
    }

    attrs[_key] = value
  })

  return attrs
}

// 行内样式转对象
export function getInlineStyles(element: any) {
  const styles: CSSProperties = {}

  const cahceStyles = parseStringStyle(element?.style?.cssText || '')

  Object.keys(cahceStyles).forEach(key => {
    styles[camelize(key)] = cahceStyles[key]
  })

  return styles
}

/**
 * docx 字体大小为 half-point 半磅  10pt * 2
 */
function convertFontSize(fontSize) {
  // 这里只使用了 pt 只做pt 处理
  return convertToNumber(fontSize) * 2
}

function convertPtToTwips(pt: number) {
  return pt * 20
}

// 提取数字
function convertToNumber(cssString) {
  const match = cssString.match(/(\d+(\.\d+)?)/)

  return match ? parseFloat(match[0]) : 0
}

// rgb 转为 hex 颜色格式
function rgbToHexColor(rgb) {
  if (isHexColor(rgb)) return rgb

  // 首先使用正则表达式匹配RGB颜色值
  const rgbMatch = rgb.match(/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*[\d.]+)?\)$/)

  // 将匹配到的RGB值转换为十六进制字符串
  function convertToHex(rgbComponent) {
    const hex = Number(rgbComponent).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  if (rgbMatch) {
    const r = convertToHex(rgbMatch[1])
    const g = convertToHex(rgbMatch[2])
    const b = convertToHex(rgbMatch[3])

    // 返回十六进制颜色值
    return '#' + r + g + b
  } else {
    return rgb // 如果输入不是有效的RGB值，则返回原始字符串
  }
}

function isHexColor(hex) {
  const regExp = /^#(?:[A-Fa-f0-9]{3}){1,2}$|^#(?:[A-Fa-f0-9]{4}){1,2}$/
  return regExp.test(hex)
}
