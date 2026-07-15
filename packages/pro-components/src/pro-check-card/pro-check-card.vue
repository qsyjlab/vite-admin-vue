<template>
  <button
    ref="buttonRef"
    type="button"
    class="pro-check-card"
    :class="{ 'is-checked': checked, 'is-disabled': disabled, 'is-loading': loading }"
    :disabled="disabled || loading"
    :role="selectionRole"
    :aria-checked="selectionRole ? checked : undefined"
    :aria-pressed="selectionRole ? undefined : checked"
    :tabindex="tabindex"
    :style="bodyStyle"
    @click="toggle"
  >
    <span class="pro-check-card__check"
      ><el-icon><Check /></el-icon
    ></span>
    <span v-if="avatar || $slots.avatar" class="pro-check-card__avatar">
      <slot name="avatar"><el-avatar :src="avatar" /></slot>
    </span>
    <span class="pro-check-card__main">
      <strong
        ><slot name="title">{{ title }}</slot></strong
      >
      <small v-if="description || $slots.description">
        <slot name="description">{{ description }}</slot>
      </small>
      <span v-if="$slots.default" class="pro-check-card__content"><slot /></span>
    </span>
    <span v-if="$slots.extra" class="pro-check-card__extra"><slot name="extra" /></span>
  </button>
</template>

<script setup lang="ts" generic="TValue extends ProCheckCardValue = ProCheckCardValue">
import { computed, useTemplateRef } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { ElAvatar, ElIcon } from 'element-plus'
import type {
  ProCheckCardExpose,
  ProCheckCardProps,
  ProCheckCardSlots,
  ProCheckCardValue
} from './pro-check-card'

defineOptions({ name: 'ProCheckCard' })
const props = withDefaults(defineProps<ProCheckCardProps<TValue>>(), { multiple: false })
const emit = defineEmits<{
  'update:model-value': [value: TValue | TValue[] | undefined]
  change: [value: TValue | TValue[] | undefined]
}>()
defineSlots<ProCheckCardSlots>()
const buttonRef = useTemplateRef<HTMLButtonElement>('buttonRef')

const checked = computed(() =>
  props.multiple
    ? Array.isArray(props.modelValue) && props.modelValue.includes(props.value)
    : props.modelValue === props.value
)

function toggle() {
  let next: TValue | TValue[] | undefined
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    next = checked.value ? values.filter(value => value !== props.value) : [...values, props.value]
  } else next = checked.value ? undefined : props.value
  emit('update:model-value', next)
  emit('change', next)
}

const exposed: ProCheckCardExpose = {
  focus: () => buttonRef.value?.focus()
}

defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-check-card {
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color-overlay);
  color: var(--el-text-color-primary);
  cursor: pointer;
  text-align: left;
  transition:
    border-color var(--el-transition-duration-fast),
    box-shadow var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary-light-5);
  }
  &:focus-visible {
    outline: 2px solid var(--el-color-primary-light-3);
    outline-offset: 2px;
  }
  &.is-checked {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 1px var(--el-color-primary) inset;
  }
  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &__check {
    position: absolute;
    top: -1px;
    right: -1px;
    display: none;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    border-bottom-left-radius: 16px;
    background: var(--el-color-primary);
    color: var(--el-color-white);
  }
  &.is-checked &__check {
    display: flex;
  }
  &__avatar {
    flex: 0 0 auto;
  }
  &__main {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 6px;
  }
  &__main strong {
    padding-right: 24px;
    font-size: 15px;
  }
  &__main small {
    color: var(--el-text-color-secondary);
    font-size: 13px;
    line-height: 1.5;
  }
  &__content {
    margin-top: 4px;
  }
  &__extra {
    flex: 0 0 auto;
  }
}
</style>
