// forked from antd
import { CSSProperties, Ref, unref } from 'vue'

const BaseSize = 2
const FontGap = 3

export interface WatermarkProps {
  zIndex?: number
  rotate?: number
  width?: number
  height?: number
  image?: string
  content?: string | string[]
  font?: {
    color?: string
    fontSize?: number | string
    fontWeight?: 'normal' | 'light' | 'weight' | number
    fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
    fontFamily?: string
  }
  style?: CSSProperties
  // className?: string
  // rootClassName?: string
  gap?: [number, number]
  offset?: [number, number]
}

// 存
const waterMarkMap = new WeakMap<HTMLElement, HTMLElement>()

interface WaterMarkFnReturn {
  render: () => void
  destroy: () => void
}

// TODO: 似乎副作用太多了 起作用的其实只有 render 部分
export function useWaterMark(
  to: Ref<HTMLElement | null> | HTMLElement,
  props?: Ref<WatermarkProps>
): WaterMarkFnReturn {
  // const target = getTarget()

  let watermarkRef: HTMLElement | null = null

  return {
    render,
    destroy
  }

  function render() {
    const target = getTarget()

    if (!target) return

    const {
      zIndex = 1000,
      rotate = -22,
      width,
      height,
      image,
      content,
      font,
      // style,
      gap = [100, 100],
      offset = [0]
    } = props?.value || {}

    const {
      color = 'rgba(0, 0, 0, 0.15)',
      fontSize = 14,
      fontWeight = 'normal',
      fontStyle = 'normal',
      fontFamily = 'sans-serif'
    } = font || {}

    const [gapX, gapY] = gap
    const gapXCenter = gapX / 2
    const gapYCenter = gapY / 2
    const offsetLeft = offset?.[0] ?? gapXCenter
    const offsetTop = offset?.[1] ?? gapYCenter
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    if (waterMarkMap.has(target)) {
      const _ref = waterMarkMap.get(target)
      if (_ref) {
        watermarkRef = _ref
      }
    } else {
      watermarkRef = document.createElement('div')
    }
    const ratio = getPixelRatio()
    const [markWidth, markHeight] = getMarkSize(ctx)
    const canvasWidth = (gapX + markWidth) * ratio
    const canvasHeight = (gapY + markHeight) * ratio
    canvas.setAttribute('width', `${canvasWidth * BaseSize}px`)
    canvas.setAttribute('height', `${canvasHeight * BaseSize}px`)
    const drawX = (gapX * ratio) / 2
    const drawY = (gapY * ratio) / 2
    const drawWidth = markWidth * ratio
    const drawHeight = markHeight * ratio
    const rotateX = (drawWidth + gapX * ratio) / 2
    const rotateY = (drawHeight + gapY * ratio) / 2
    const alternateDrawX = drawX + canvasWidth
    const alternateDrawY = drawY + canvasHeight
    const alternateRotateX = rotateX + canvasWidth
    const alternateRotateY = rotateY + canvasHeight
    ctx.save()
    rotateWatermark(ctx, rotateX, rotateY, rotate)
    drawText(
      canvas,
      ctx,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
      alternateRotateX,
      alternateRotateY,
      alternateDrawX,
      alternateDrawY,
      markWidth
    )

    if (watermarkRef) {
      waterMarkMap.set(target, watermarkRef)
    }

    function drawText(
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D,
      drawX: number,
      drawY: number,
      drawWidth: number,
      drawHeight: number,
      alternateRotateX: number,
      alternateRotateY: number,
      alternateDrawX: number,
      alternateDrawY: number,
      markWidth: number
    ) {
      fillTexts(ctx, drawX, drawY, drawWidth, drawHeight)
      /** Fill the interleaved text after rotation */
      ctx.restore()
      rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate)
      fillTexts(ctx, alternateDrawX, alternateDrawY, drawWidth, drawHeight)
      appendWatermark(canvas.toDataURL(), markWidth)
    }

    function fillTexts(
      ctx: CanvasRenderingContext2D,
      drawX: number,
      drawY: number,
      drawWidth: number,
      drawHeight: number
    ) {
      const ratio = getPixelRatio()
      const mergedFontSize = Number(fontSize) * ratio
      ctx.font = `${fontStyle} normal ${fontWeight} ${mergedFontSize}px/${drawHeight}px ${fontFamily}`
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.translate(drawWidth / 2, 0)
      const contents = Array.isArray(content) ? content : [content]
      contents?.forEach((item, index) => {
        ctx.fillText(item ?? '', drawX, drawY + index * (mergedFontSize + FontGap * ratio))
      })
    }

    function getMarkSize(ctx: CanvasRenderingContext2D) {
      let defaultWidth = 120
      let defaultHeight = 64
      if (!image && ctx.measureText) {
        ctx.font = `${Number(fontSize)}px ${fontFamily}`
        const contents = Array.isArray(content) ? content : [content]
        const widths = contents.map(item => ctx.measureText(item || '').width)
        defaultWidth = Math.ceil(Math.max(...widths))
        defaultHeight = Number(fontSize) * contents.length + (contents.length - 1) * FontGap
      }
      return [width ?? defaultWidth, height ?? defaultHeight] as const
    }

    function getMarkStyle() {
      const markStyle: CSSProperties = {
        zIndex,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundRepeat: 'repeat'
      }

      /** Calculate the style of the offset */
      let positionLeft = offsetLeft - gapXCenter
      let positionTop = offsetTop - gapYCenter
      if (positionLeft > 0) {
        markStyle.left = `${positionLeft}px`
        markStyle.width = `calc(100% - ${positionLeft}px)`
        positionLeft = 0
      }
      if (positionTop > 0) {
        markStyle.top = `${positionTop}px`
        markStyle.height = `calc(100% - ${positionTop}px)`
        positionTop = 0
      }
      markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`

      return markStyle
    }

    function appendWatermark(base64Url: string, markWidth: number) {
      if (!watermarkRef) return

      watermarkRef.setAttribute(
        'style',
        getStyleStr({
          ...getMarkStyle(),
          backgroundImage: `url('${base64Url}')`,
          backgroundSize: `${(gapX + markWidth) * BaseSize}px`
        })
      )

      if (target) {
        target.append(watermarkRef)
      }
    }
  }

  function destroy() {
    if (watermarkRef) {
      watermarkRef.remove()
      watermarkRef = null

      const target = getTarget()

      if (target) {
        waterMarkMap.delete(target)
      }
    }
  }

  function getTarget() {
    return unref(to)
  }
}

function getPixelRatio() {
  return window.devicePixelRatio || 1
}

export function rotateWatermark(
  ctx: CanvasRenderingContext2D,
  rotateX: number,
  rotateY: number,
  rotate: number
) {
  ctx.translate(rotateX, rotateY)
  ctx.rotate((Math.PI / 180) * Number(rotate))
  ctx.translate(-rotateX, -rotateY)
}

export function getStyleStr(style: CSSProperties): string {
  return Object.keys(style)
    .map((key: any) => `${toLowercaseSeparator(key)}: ${style[key]};`)
    .join(' ')
}

export function toLowercaseSeparator(key: string) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase()
}
