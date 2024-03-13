<template>
  <div :class="['page-card', full ? 'is-full' : '']">
    <div v-if="header || slost.header" class="page-card__header">
      <div class="card-header">
        <slot name="header">{{ header }}</slot>
      </div>
    </div>
    <div class="page-card__body">
      <slot name="default"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import './page-card.scss'

defineOptions({
  name: 'PageCard'
})

withDefaults(
  defineProps<{
    /** 头部 */
    header?: string
    /** 是否充满容器 */
    full?: boolean
  }>(),
  {
    full: true
  }
)

const slost = defineSlots<{
  header?: () => void
  default?: () => void
}>()
</script>
