<template>
  <!-- svg 精灵图 -->
  <svg-icon v-if="iconType === 'svg'" :name="iconName" :size="size" :color="color" />

  <!-- iconify -->
  <iconify v-else-if="iconType === 'ify'" :icon="iconName" :size="size" :color="color" />

  <!-- element-plus -->
  <ep-icon v-else-if="iconType === 'ep'" :icon="iconName" :size="size" :color="color" />
  <span v-else></span>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'

import SvgIcon from './svg-icon.vue'
import Iconify from './iconify.vue'
import EpIcon from './ep.vue'
import { useLayoutStore } from '@/store'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'Icon'
})

const props = withDefaults(
  defineProps<{
    icon?: string
    size?: number
    color?: string
  }>(),
  {
    size: 24
  }
)

const iconType = ref('')
const iconName = ref('')

watch(
  () => ref(props),
  () => {
    const nSplit = props.icon?.split('.')
    iconType.value = nSplit?.[0] || ''
    iconName.value = nSplit?.[1] || ''
  },
  {
    immediate: true
  }
)
</script>
