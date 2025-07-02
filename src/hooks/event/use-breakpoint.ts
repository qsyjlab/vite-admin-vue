import { ref, computed, type ComputedRef, unref, onUnmounted } from 'vue'

export enum sizeEnum {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL'
}

let globalScreenRef: ComputedRef<sizeEnum | undefined> = computed(() => undefined)
let globalRealWidthRef: ComputedRef<number> = computed(() => 0)

export interface CreateCallbackParams {
  screen: ComputedRef<sizeEnum | undefined>
  realWidth: ComputedRef<number>
  sizeEnum: typeof sizeEnum
}

export function useBreakpoint() {
  return {
    screenRef: computed(() => unref(globalScreenRef)),
    realWidthRef: globalRealWidthRef
  }
}

// Just call it once
export function createBreakpointListener(fn?: (opt: CreateCallbackParams) => void) {
  const screenRef = ref<sizeEnum>(sizeEnum.XL)
  const realWidthRef = ref(window.innerWidth)

  function getWindowWidth() {
    const width = document.body.clientWidth

    if (width >= 1920) {
      screenRef.value = sizeEnum.XL
    } else if (width >= 1200) {
      screenRef.value = sizeEnum.LG
    } else if (width >= 992) {
      screenRef.value = sizeEnum.MD
    } else if (width >= 768) {
      screenRef.value = sizeEnum.SM
    } else {
      screenRef.value = sizeEnum.XS
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

  globalRealWidthRef = computed((): number => unref(realWidthRef))

  function resizeFn() {
    fn?.({
      screen: globalScreenRef,
      realWidth: globalRealWidthRef,
      sizeEnum
    })
  }

  resizeFn()
  return {
    screenRef: globalScreenRef,
    realWidthRef: globalRealWidthRef
  }
}
