<template>
  <!-- svg 精灵图 -->
  <svg-icon v-if="iconType === 'svg'" :name="iconName" :size="size" :color="color" />

  <!-- element-plus -->
  <ep-icon v-else-if="iconType === 'ep'" :icon="iconName" :size="size" :color="color" />

  <!-- vnode  -->
  <component :is="icon()" v-else-if="iconType === 'vnode' && isFunction(icon)" />
  <span v-else></span>
</template>

<script setup lang="ts">
import { watch, ref, VNode } from 'vue'

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
