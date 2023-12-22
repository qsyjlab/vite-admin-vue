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
        // emit('error')
      } finally {
        // loadingRef.value = false
      }
    }
    reader.readAsArrayBuffer(rawFile)
  })
}
