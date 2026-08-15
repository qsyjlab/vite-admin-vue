<template>
  <span class="pro-icon" :style="iconStyle" aria-hidden="true">
    <!-- svg 精灵图 -->
    <svg-icon v-if="iconType === 'svg'" :name="iconName" :size="size" :color="color" />

    <!-- element-plus -->
    <ep-icon v-else-if="iconType === 'ep'" :icon="iconName" :size="size" :color="color" />

    <!-- vnode  -->
    <component :is="icon()" v-else-if="iconType === 'vnode' && isFunction(icon)" />
  </span>
</template>

<script setup lang="ts">
import { computed, watch, ref, type CSSProperties, type VNode } from 'vue'

import SvgIcon from './svg-icon.vue'
import EpIcon from './ep.vue'
import { isFunction } from '@/utils'

defineOptions({
  name: 'ProIcon'
})

const props = withDefaults(
  defineProps<{
    icon?: string | (() => VNode)
    size?: number
    color?: string
  }>(),
  {
    size: 24
  }
)

const iconType = ref('')
const iconName = ref<any>('')

const iconStyle = computed<CSSProperties>(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  color: props.color
}))

watch(
  ref(props),
  () => {
    if (isFunction(props.icon)) {
      iconType.value = 'vnode'
      iconName.value = props.icon
    } else {
      const nSplit = props.icon?.split('.')
      iconType.value = nSplit?.[0] || ''
      iconName.value = nSplit?.[1] || ''
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.pro-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  line-height: 1;
  vertical-align: middle;

  :deep(.el-icon),
  :deep(.svg-icon),
  :deep(svg) {
    display: block;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    flex: 0 0 100%;
  }
}
</style>
