<template>
  <div :class="['basic-layout-logo', { 'is-compact': isCompact }]" :style="styles">
    <div class="basic-layout-logo__img" :style="logoImageStyle">
      <img :src="projectSetting.logo" alt="/" />
    </div>
    <div
      class="basic-layout-logo__title"
      :style="{
        display: showTitle ? 'block' : 'none'
      }"
    >
      {{ config.projectTitle }}
    </div>
  </div>
</template>
<script setup lang="ts">
import config from '@/config'
import projectSetting from '@/config/project-setting'
import { computed, type CSSProperties } from 'vue'

interface IProps {
  logoWidth?: number
  showTitle?: boolean
  height?: number
  width?: number
  transitionDuration?: number
  transitionTimingFunction?: string
}

const props = withDefaults(defineProps<IProps>(), {
  logoWidth: 42,
  showTitle: true,
  width: 220,
  height: 48,
  transitionDuration: 300,
  transitionTimingFunction: 'ease-in-out'
})

const isCompact = computed(() => !props.showTitle || props.width <= 60)

const styles = computed<CSSProperties>(() => {
  const { width, height } = props
  return {
    width: `${width}px`,
    height: `${height}px`,
    '--basic-logo-height': `${height}px`,
    '--basic-logo-width': `${width}px`,
    '--basic-logo-image-width': `${props.logoWidth}px`
  }
})

const logoImageStyle = computed<CSSProperties>(() => {
  const visualSize = Math.max(0, Math.min(props.logoWidth, props.height * 0.8))

  return {
    width: `${visualSize}px`,
    height: `${visualSize}px`
  }
})
</script>
