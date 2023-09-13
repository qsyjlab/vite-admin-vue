import { ref, computed, ComputedRef, unref, onUnmounted } from 'vue'

export enum sizeEnum {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL'
  // XXL = 'XXL'
}

export enum screenEnum {
  XS = 768,
  SM = 992,
  MD = 1200,
  LG = 1920
}

const screenMap = new Map<sizeEnum, number>()

screenMap.set(sizeEnum.XS, screenEnum.XS)
screenMap.set(sizeEnum.SM, screenEnum.SM)
screenMap.set(sizeEnum.MD, screenEnum.MD)
screenMap.set(sizeEnum.LG, screenEnum.LG)

export { screenMap }

let globalScreenRef: ComputedRef<sizeEnum | undefined>
let globalWidthRef: ComputedRef<number>
let globalRealWidthRef: ComputedRef<number>

export interface CreateCallbackParams {
  screen: ComputedRef<sizeEnum | undefined>
  width: ComputedRef<number>
  realWidth: ComputedRef<number>
  screenEnum: typeof screenEnum
  screenMap: Map<sizeEnum, number>
  sizeEnum: typeof sizeEnum
}

export function useBreakpoint() {
  return {
    screenRef: computed(() => unref(globalScreenRef)),
    widthRef: globalWidthRef,
    screenEnum,
    realWidthRef: globalRealWidthRef
  }
}

// Just call it once
export function createBreakpointListener(fn?: (opt: CreateCallbackParams) => void) {
  const screenRef = ref<sizeEnum>(sizeEnum.XL)
  const realWidthRef = ref(window.innerWidth)

  function getWindowWidth() {
    const width = document.body.clientWidth
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const xs = screenMap.get(sizeEnum.XS)!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const sm = screenMap.get(sizeEnum.SM)!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const md = screenMap.get(sizeEnum.MD)!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lg = screenMap.get(sizeEnum.LG)!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // const xl = screenMap.get(sizeEnum.XL)!
    if (width < xs) {
      screenRef.value = sizeEnum.XS
    } else if (width < sm) {
      screenRef.value = sizeEnum.SM
    } else if (width < md) {
      screenRef.value = sizeEnum.MD
    } else if (width < lg) {
      screenRef.value = sizeEnum.LG
    } else {
      screenRef.value = sizeEnum.XL
      // screenRef.value = sizeEnum.XXL
    }
    realWidthRef.value = width
  }

  onUnmounted(() => {
    window.removeEventListener('resize', resizeListener)
  })

  const resizeListener = () => {
    getWindowWidth()
    resizeFn()
  }

  window.addEventListener('resize', resizeListener)

  getWindowWidth()
  globalScreenRef = computed(() => unref(screenRef))
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  globalWidthRef = computed((): number => screenMap.get(unref(screenRef)!)!)
  globalRealWidthRef = computed((): number => unref(realWidthRef))

  function resizeFn() {
    fn?.({
      screen: globalScreenRef,
      width: globalWidthRef,
      realWidth: globalRealWidthRef,
      screenEnum,
      screenMap,
      sizeEnum
    })
  }

  resizeFn()
  return {
    screenRef: globalScreenRef,
    screenEnum,
    widthRef: globalWidthRef,
    realWidthRef: globalRealWidthRef
  }
}
