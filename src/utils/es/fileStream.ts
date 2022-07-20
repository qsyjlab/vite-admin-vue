/*
 * @Description: 文件流
 * @Version:
 * @Autor: qsyj
 * @Date: 2022-03-25 17:41:22
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 14:08:59
 */

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
