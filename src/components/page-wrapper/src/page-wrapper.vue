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
    flex: 1 1 auto;
    min-height: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
}
</style>
