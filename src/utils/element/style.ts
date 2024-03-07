import { CSSProperties } from 'vue'

const listDelimiterRE = /;(?![^(]*\))/g
const propertyDelimiterRE = /:([^]+)/
const styleCommentRE = /\/\*[^]*?\*\//g

/**
 *
 * @example
 * "border: 1px solid transparent;color:red;" => { border:"1px solid transparent", color: 'red'  }
 */
export function parseStringStyle(cssText: string): CSSProperties {
  const ret: CSSProperties = {}
  cssText
    .replace(styleCommentRE, '')
    .split(listDelimiterRE)
    .forEach(item => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE)
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim())
      }
    })
  return ret
}
