<template>
  <div class="basic-layout-logo" :style="styles">
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
import { computed, CSSProperties } from 'vue'

interface IProps {
  logoWidth?: number
  showTitle?: boolean
  height?: number
  width?: number
  transitionDuration?: number
  transitionTimingFunction?: string
}

const props = withDefaults(defineProps<IProps>(), {
  logoWidth: 78,
  showTitle: true,
  width: 220,
  height: 48,
  transitionDuration: 300,
  transitionTimingFunction: 'ease-in-out'
})

const styles = computed<CSSProperties>(() => {
  const { width, height } = props
  return {
    width: `${width}px`,
    height: `${height}px`
  }
})

const logoImageStyle = computed<CSSProperties>(() => {
  return {
    width: `${props.logoWidth}px`
  }
})
</script>
