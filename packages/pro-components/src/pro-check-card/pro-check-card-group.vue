<template>
  <div
    ref="groupRef"
    class="pro-check-card-group"
    :style="groupStyle"
    :role="multiple ? 'group' : 'radiogroup'"
    @focusin="handleFocusIn"
    @keydown="handleKeydown"
  >
    <pro-check-card
      v-for="(option, index) in options"
      :key="String(option.value)"
      v-bind="option"
      :data-card-index="index"
      :model-value="modelValue"
      :multiple="multiple"
      :selection-role="multiple ? 'checkbox' : 'radio'"
      :tabindex="index === activeIndex ? 0 : -1"
      @update:model-value="handleValueChange"
    />
  </div>
</template>

<script setup lang="ts" generic="TValue extends ProCheckCardValue = ProCheckCardValue">
import { computed, nextTick, ref, watch } from 'vue'
import { useFormItem } from 'element-plus'
import ProCheckCard from './pro-check-card.vue'
import type { ProCheckCardOption, ProCheckCardValue } from './pro-check-card'
import {
  getInitialProCheckCardIndex,
  getNextProCheckCardIndex,
  isProCheckCardOptionEnabled,
  type ProCheckCardNavigationKey
} from './pro-check-card-utils'

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
const emit = defineEmits<{
  'update:model-value': [value: TValue | TValue[] | undefined]
  change: [value: TValue | TValue[] | undefined]
}>()
const groupRef = ref<HTMLDivElement>()
const { formItem } = useFormItem()
const activeIndex = ref(
  getInitialProCheckCardIndex(props.options, props.modelValue, props.multiple)
)
const groupStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(1, props.columns)}, minmax(0, 1fr))`,
  gap: typeof props.gap === 'number' ? `${props.gap}px` : props.gap
}))

watch(
  () => [props.options, props.modelValue, props.multiple] as const,
  () => {
    const currentOption = props.options[activeIndex.value]
    if (currentOption && isProCheckCardOptionEnabled(currentOption)) return
    activeIndex.value = getInitialProCheckCardIndex(props.options, props.modelValue, props.multiple)
  },
  { deep: true }
)

function handleValueChange(value: TValue | TValue[] | undefined) {
  emit('update:model-value', value)
  emit('change', value)
  void nextTick(() => formItem?.validate('change').catch(() => undefined))
}

function handleFocusIn(event: FocusEvent) {
  const target = event.target
  if (!(target instanceof HTMLElement)) return
  const card = target.closest<HTMLElement>('[data-card-index]')
  const index = Number(card?.dataset.cardIndex)
  if (Number.isInteger(index)) activeIndex.value = index
}

function handleKeydown(event: KeyboardEvent) {
  if (!isNavigationKey(event.key)) return
  const nextIndex = getNextProCheckCardIndex(props.options, activeIndex.value, event.key)
  if (nextIndex < 0) return
  event.preventDefault()
  activeIndex.value = nextIndex
  void nextTick(() => {
    groupRef.value?.querySelector<HTMLButtonElement>(`[data-card-index="${nextIndex}"]`)?.focus()
  })
}

function isNavigationKey(key: string): key is ProCheckCardNavigationKey {
  return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)
}
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
