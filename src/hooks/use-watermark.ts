import { getCurrentInstance, onBeforeUnmount, ref, Ref, shallowRef, unref } from 'vue'
// import { useRafThrottle } from '/@/utils/domUtils'
// import { addResizeListener, removeResizeListener } from '/@/utils/event'
// import { isDef } from '/@/utils/is'

const domSymbol = Symbol('watermark-dom')

const sourceMap = new WeakMap<HTMLElement, WaterMark>()

interface WaterMark {
  setWatermark: (str: string) => void
  clear: () => void
}
export function useWatermark(
  appendEl: Ref<HTMLElement | null> = ref(document.body) as Ref<HTMLElement>
): WaterMark {
  const appendElRaw = unref(appendEl)
  if (appendElRaw && sourceMap.has(appendElRaw)) {
    return sourceMap.get(appendElRaw) || { setWatermark, clear }
  }
  const func = () => {
    const el = unref(appendEl)
    if (!el) return
    const { clientHeight: height, clientWidth: width } = el
    updateWatermark({ height, width })
  }
  const id = domSymbol.toString()
  const watermarkEl = shallowRef<HTMLElement>()

  function clear() {
    const domId = unref(watermarkEl)
    watermarkEl.value = undefined
    const el = unref(appendEl)
    if (!el) return
    domId && el.removeChild(domId)
    window.removeEventListener('resize', func)
    // removeResizeListener(el, func)
  }

  function createBase64(str: string) {
    const can = document.createElement('canvas')
    const width = 300
    const height = 240
    Object.assign(can, { width, height })

    const cans = can.getContext('2d')
    if (cans) {
      cans.rotate((-20 * Math.PI) / 120)
      cans.font = '15px Vedana'
      cans.fillStyle = 'rgba(0, 0, 0, 0.15)'
      cans.textAlign = 'left'
      cans.textBaseline = 'middle'
      cans.fillText(str, width / 20, height)
    }
    return can.toDataURL('image/png')
  }

  function updateWatermark(
    options: {
      width?: number
      height?: number
      str?: string
    } = {}
  ) {
    const el = unref(watermarkEl)
    if (!el) return
    if (options.width) {
      el.style.width = `${options.width}px`
    }
    if (options.height) {
      el.style.height = `${options.height}px`
    }
    if (options.str) {
      el.style.background = `url(${createBase64(options.str || '')}) left top repeat`
    }
  }

  const createWatermark = (str: string) => {
    if (unref(watermarkEl)) {
      updateWatermark({ str })
      return id
    }
    const div = document.createElement('div')
    watermarkEl.value = div
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.position = 'absolute'
    div.style.zIndex = '100000'
    const el = unref(appendEl)
    if (!el) return id
    const { clientHeight: height, clientWidth: width } = el
    updateWatermark({ str, width, height })
    el.appendChild(div)
    sourceMap.set(el, { setWatermark, clear })
    return id
  }

  function setWatermark(str: string) {
    createWatermark(str)
    window.addEventListener('resize', func)
    // addResizeListener(document.documentElement, func)
    const instance = getCurrentInstance()
    if (instance) {
      onBeforeUnmount(() => {
        clear()
      })
    }
  }

  return { setWatermark, clear }
}
