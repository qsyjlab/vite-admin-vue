<template>
  <div :style="getWrapStyle" v-loading="loading">
    <iframe
      :src="frameSrc"
      :class="`iframe-page__main`"
      ref="frameRef"
      @load="hideLoading"
    ></iframe>
  </div>
</template>
<script lang="ts" setup>
import type { CSSProperties, IframeHTMLAttributes } from 'vue'
import { PropType } from 'vue'
import { ref, unref, computed } from 'vue'

const props = defineProps({
  frameSrc: {
    type: String,
    default: 'https://qsyjlab.club/'
  },
  height: {
    type: [String, Number] as PropType<CSSProperties['height']>,
    default: '100%'
  }
})

const loading = ref(true)
const topRef = ref(50)
const heightRef = ref(window.innerHeight)
const frameRef = ref<IframeHTMLAttributes>()
// const { headerHeightRef } = useLayoutHeight()

// const { prefixCls } = useDesign('iframe-page')
// useWindowSizeFn(calcHeight, { wait: 150, immediate: true })

const getWrapStyle = computed((): CSSProperties => {
  console.log('props', props)

  return {
    height: `${props.height}`
  }
})

// function calcHeight() {
//   const iframe = unref(frameRef)
//   if (!iframe) {
//     return
//   }
//   const top = 0
//   topRef.value = top
//   heightRef.value = window.innerHeight - top
//   const clientHeight = document.documentElement.clientHeight - top

//   iframe.style = {
//     height: `${clientHeight}px`
//   }
// }

function hideLoading() {
  loading.value = false
  // calcHeight()
}
</script>
<style lang="scss" scoped>
.iframe-page {
  // &__mask {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  // }

  &__main {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
  }
}
</style>
