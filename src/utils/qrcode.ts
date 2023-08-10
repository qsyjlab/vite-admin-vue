import { toCanvas, QRCodeRenderersOptions, toDataURL } from 'qrcode'

export interface LogoOptions {
  src: string
  size?: number
  bgColor?: string
  // borderSize: number
  crossOrigin?: string
  // borderRadius: number
}

export { QRCodeRenderersOptions } from 'qrcode'

export function renderQrcodeToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options?: Partial<QRCodeRenderersOptions>
) {
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    toCanvas(canvas, text, { ...(options || {}) }, error => {
      if (error) reject(error)
      resolve(canvas)
    })
  })
}

export function drawLogo(canvas: HTMLCanvasElement, options?: LogoOptions) {
  const { size = 30, crossOrigin } = options || {}
  if (options?.src) {
    const img = new Image()
    img.src = options?.src || ''
    img.width = size
    img.height = size

    if (crossOrigin) {
      img.setAttribute('crossOrigin', crossOrigin || 'anonymous')
    }

    img.onload = () => {
      const context = canvas.getContext('2d')
      const x = (canvas.width - size) / 2
      const y = (canvas.height - size) / 2
      context?.drawImage(img, x, y, size, size)
    }
  }
}
