<template>
  <div class="pro-check-card-group" :style="groupStyle">
    <pro-check-card
      v-for="option in options"
      :key="String(option.value)"
      v-bind="option"
      :model-value="modelValue"
      :multiple="multiple"
      @update:model-value="value => $emit('update:model-value', value)"
      @change="value => $emit('change', value)"
    />
  </div>
</template>

<script setup lang="ts" generic="TValue extends ProCheckCardValue = ProCheckCardValue">
import { computed } from 'vue'
import ProCheckCard from './pro-check-card.vue'
import type { ProCheckCardOption, ProCheckCardValue } from './pro-check-card'

defineOptions({ name: 'ProCheckCardGroup' })
const props = withDefaults(
  defineProps<{
    modelValue?: TValue | TValue[]
    options?: ProCheckCardOption<TValue>[]
    multiple?: boolean
    columns?: number
    gap?: number | string
  }>(),
  { options: () => [], multiple: false, columns: 3, gap: 12 }
)
defineEmits<{
  'update:model-value': [value: TValue | TValue[] | undefined]
  change: [value: TValue | TValue[] | undefined]
}>()
const groupStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(1, props.columns)}, minmax(0, 1fr))`,
  gap: typeof props.gap === 'number' ? `${props.gap}px` : props.gap
}))
</script>

<style scoped lang="scss">
.pro-check-card-group {
  display: grid;
  min-width: 0;
}
@media (max-width: 760px) {
  .pro-check-card-group {
    grid-template-columns: 1fr !important;
  }
}
</style>
