import { downloadFile } from '../file'

/**
 * 获取静态资源路径
 */
export function getAssetsSource(path: string) {
  const url = new URL(`/src/assets/${path}`, import.meta.url).href
  return url
}

/**
 * 下载静态模版
 *
 */
export function dowloadPublicTemplate(tempalteName: string) {
  if (!tempalteName) return

  let base = import.meta.env.VITE_BASE_URL || '/'

  if (!base.endsWith('/')) {
    base += '/'
  }

  const path = `${base}template/${tempalteName}`
  return downloadFile(path, tempalteName)
}
