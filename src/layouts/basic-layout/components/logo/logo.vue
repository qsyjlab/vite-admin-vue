<template>
  <div class="basic-layout-logo" :style="styles">
    <div class="basic-layout-logo__img" :style="logoImageStyle">
      <img src="/vite.svg" alt="/" />
    </div>
    <div
      class="basic-layout-logo__title"
      :style="{
        display: showTitle ? 'block' : 'none'
      }"
    >
      Vue Admin
    </div>
  </div>
</template>
<script setup lang="ts">
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
  logoWidth: 65,
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

<style lang="scss" scoped>
.basic-layout {
  &-logo {
    overflow: hidden;
    height: 56px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    &__img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      flex-shrink: 0;
    }
  }
}
</style>
