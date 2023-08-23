<template>
  <div class="page-card">
    <div class="page-card__header">
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

withDefaults(
  defineProps<{
    header?: string
  }>(),
  {}
)

defineSlots<{
  header?: () => void
  default?: () => void
}>()
</script>
