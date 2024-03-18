import { isBlob, isFile, isString } from '../type'

/**
 *  base64 to blob
 * @param {String} dataURI base64
 * @returns {Blob}
 */
export function dataURItoBlob(dataURI: string) {
  // base64 解码
  const byteString = window.atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

/**
 * 1024 * 1024 * 20 => 20mb
 */
export function bytesToSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

export function fileReader(rawFile: File): Promise<FileReader['result']> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async e => {
      try {
        resolve(e.target!.result)
      } catch (error) {
        reject(error)
      } finally {
      }
    }
    reader.readAsArrayBuffer(rawFile)
  })
}

// 文件下载方法
export function downloadFile(href: string, filename?: string) {
  if (href && filename) {
    const a: HTMLAnchorElement = document.createElement('a')
    a.download = filename
    a.href = href
    a.click()
    URL.revokeObjectURL(a.href)
  }
}

// 文件转 blob 链接
export function fileToObjectURL(file: File) {
  return URL.createObjectURL(new Blob([file], { type: file.type }))
}

/**
 * 将只转换成 blob 类型
 * 1.文件类型转换
 * 2.地址类型转换
 * 3.如果直接是 blob 则直接返回
 */
export async function convertUnknownObjectToBlob(file: unknown): Promise<Blob | null> {
  if (isString(file)) {
    return new Promise(resolve => {
      fetch(file, { mode: 'cors' }).then(response => {
        if (response.ok) {
          resolve(response.blob())
        }
        return null
      })
    })
  }
  if (isFile(file)) return new Blob([file], { type: file.type })
  if (isBlob(file)) return file

  return null
}
