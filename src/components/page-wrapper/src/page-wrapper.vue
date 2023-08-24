<template>
  <div :class="['page-wrapper', full ? 'is-full' : '']">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageWrapper'
})

defineSlots<{
  default: () => void
}>()

withDefaults(
  defineProps<{
    full?: boolean
  }>(),
  {
    full: true
  }
)
</script>
<style lang="scss" scoped>
.page-wrapper {
  padding: 10px;
  &.is-full {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
