<template>
  <Icon :icon="icon || ''" :color="color" :width="size" :height="size" />
</template>

<script setup lang="ts">
import { Icon, disableCache } from '@iconify/vue'

defineOptions({
  name: 'Iconify'
})

// 关闭 iconify cache
disableCache('all')

withDefaults(
  defineProps<{
    icon?: string
    size?: number
    color?: string
  }>(),
  {
    size: 24
  }
)
</script>
