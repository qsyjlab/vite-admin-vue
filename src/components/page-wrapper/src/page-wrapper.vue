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
  width: 100%;
  padding: 16px;
  box-sizing: border-box;

  &.is-full {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 767px) {
  .page-wrapper {
    padding: 10px;
  }
}
</style>
