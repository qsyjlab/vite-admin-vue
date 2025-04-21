<template>
  <div v-loading="loading" :style="getWrapStyle">
    <iframe
      ref="frameRef"
      :src="frameSrc"
      :class="`iframe-page__main`"
      @load="hideLoading"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties, IframeHTMLAttributes } from 'vue'
import type { PropType } from 'vue'
import { ref, computed } from 'vue'

const props = defineProps({
  frameSrc: {
    type: String,
    default: ''
  },
  height: {
    type: [String, Number] as PropType<CSSProperties['height']>,
    default: '100%'
  }
})

const loading = ref(true)

const frameRef = ref<IframeHTMLAttributes>()

const getWrapStyle = computed((): CSSProperties => {
  console.log('props', props)

  return {
    height: `${props.height}`
  }
})

function hideLoading() {
  loading.value = false
}
</script>
<style lang="scss" scoped>
.iframe-page {
  &__main {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
  }
}
</style>
