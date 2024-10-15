/**
 *
 * 过滤富文本标签
 */
export function filterHTMLTag(text: string): string {
  if (!text) return ''
  text = text.replace(/<\/?[^>]*>/g, '') //去除HTML Tag
  text = text.replace(/[|]*\n/, '') //去除行尾空格
  text = text.replace(/&npsp;/gi, '') //去掉npsp
  // 移除空格
  text = text.replace(/&nbsp;/gi, '')
  text = text.replace(/['"\\/\b\f\n\r\t]/g, '') // 去除转义字符

  return text
}
