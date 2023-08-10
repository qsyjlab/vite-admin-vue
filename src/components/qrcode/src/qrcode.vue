<template>
  <div class="qrcode">
    <canvas ref="qrcodeRef"></canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
// import Qrcode from 'qrcode'
import { renderQrcodeToCanvas, drawLogo } from '@/utils/qrcode'
import type { LogoOptions, QRCodeRenderersOptions } from '@/utils/qrcode'

const qrcodeRef = ref<HTMLCanvasElement>()

interface IProps {
  /** 二维码版本 */
  version?: number
  /** 纠错级别 ： low, medium, quartile, high */
  errorLevel?: QRCodeRenderersOptions['errorCorrectionLevel']
  /** 四周边距 */
  margin?: number
  /** 缩放 */
  scale?: QRCodeRenderersOptions['scale']
  text: string
  type?: 'canvas'
  size?: number
  logo?: string | LogoOptions
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'canvas',
  size: 160
})

onMounted(() => {
  render()
})

watch(
  () => props,
  () => {
    render()
  },
  {
    deep: true
  }
)

function render() {
  if (qrcodeRef.value) {
    renderQrcodeToCanvas(qrcodeRef.value, props.text, {
      width: props.size,
      version: props.version,
      errorCorrectionLevel: props.errorLevel,
      margin: props.margin,
      scale: props.scale
    }).then(canvas => {
      if (props.logo) {
        if (typeof props.logo === 'string') {
          drawLogo(canvas, { src: props.logo })
        } else {
          drawLogo(canvas, props.logo)
        }
      }
    })
  }
}
</script>
<style scoped></style>
