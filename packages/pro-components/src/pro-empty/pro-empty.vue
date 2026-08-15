<template>
  <div
    class="pro-empty"
    :class="[`is-${status}`, { 'is-compact': compact }]"
    :style="bodyStyle"
    role="status"
  >
    <div class="pro-empty__image" :style="imageStyle" aria-hidden="true">
      <slot name="image">
        <img v-if="image" :src="image" alt="" />
        <svg v-else viewBox="0 0 128 96" fill="none">
          <path class="pro-empty__surface" d="M18 71 36 31h56l18 40-14 12H32L18 71Z" />
          <path class="pro-empty__panel" d="M38 18h52v48H38z" />
          <path class="pro-empty__line" d="M49 33h30M49 43h22" />
          <circle v-if="status === 'search'" class="pro-empty__accent" cx="88" cy="61" r="13" />
          <path v-if="status === 'search'" class="pro-empty__accent-line" d="m98 71 10 10" />
          <path
            v-if="status === 'error'"
            class="pro-empty__accent-line"
            d="m58 37 13 13m0-13L58 50"
          />
          <path
            v-if="status === 'forbidden'"
            class="pro-empty__accent-line"
            d="M58 51V39a7 7 0 0 1 14 0v12m-18 0h22v17H54z"
          />
        </svg>
      </slot>
    </div>

    <div class="pro-empty__title">
      <slot name="title">{{ resolvedTitle }}</slot>
    </div>
    <div v-if="resolvedDescription || $slots.description" class="pro-empty__description">
      <slot name="description">{{ resolvedDescription }}</slot>
    </div>
    <div v-if="hasExtra" class="pro-empty__extra">
      <slot name="extra">
        <button
          v-if="actionText"
          class="pro-empty__action is-primary"
          type="button"
          @click="$emit('action')"
        >
          {{ actionText }}
        </button>
        <button
          v-if="secondaryActionText"
          class="pro-empty__action"
          type="button"
          @click="$emit('secondary-action')"
        >
          {{ secondaryActionText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { ProEmptyProps, ProEmptySlots } from './pro-empty'

defineOptions({ name: 'ProEmpty' })

const props = withDefaults(defineProps<ProEmptyProps>(), {
  status: 'empty',
  imageSize: 112,
  compact: false
})
defineEmits<{
  action: []
  'secondary-action': []
}>()
defineSlots<ProEmptySlots>()

const slots = useSlots()
const defaults = computed(() => {
  const values = {
    empty: ['暂无数据', '当前还没有可以展示的内容'],
    search: ['未找到结果', '请调整搜索条件后重试'],
    error: ['加载失败', '数据加载时发生错误，请稍后重试'],
    forbidden: ['暂无权限', '你没有访问当前内容的权限']
  }
  return values[props.status]
})
const resolvedTitle = computed(() => props.title ?? defaults.value[0])
const resolvedDescription = computed(() => props.description ?? defaults.value[1])
const imageStyle = computed(() => ({
  width: typeof props.imageSize === 'number' ? `${props.imageSize}px` : props.imageSize
}))
const hasExtra = computed(() =>
  Boolean(slots.extra || props.actionText || props.secondaryActionText)
)
</script>

<style scoped lang="scss">
.pro-empty {
  display: flex;
  min-width: 0;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 48px 24px;
  color: var(--el-text-color-primary, #303133);
  text-align: center;

  &__image {
    max-width: 100%;
    margin-bottom: 18px;

    img,
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  &__surface {
    fill: var(--el-fill-color-light, #f5f7fa);
    stroke: var(--el-border-color, #dcdfe6);
  }

  &__panel {
    fill: var(--el-bg-color-overlay, #fff);
    stroke: var(--el-border-color-light, #e4e7ed);
  }

  &__line {
    stroke: var(--el-border-color, #dcdfe6);
    stroke-linecap: round;
    stroke-width: 4;
  }

  &__accent {
    fill: var(--el-bg-color-overlay, #fff);
    stroke: var(--el-color-primary, #409eff);
    stroke-width: 4;
  }

  &__accent-line {
    fill: none;
    stroke: var(--el-color-primary, #409eff);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 5;
  }

  &.is-error &__accent-line {
    stroke: var(--el-color-danger, #f56c6c);
  }

  &.is-forbidden &__accent-line {
    stroke: var(--el-color-warning, #e6a23c);
  }

  &__title {
    font-size: var(--el-font-size-medium, 16px);
    font-weight: 600;
    line-height: 1.5;
  }

  &__description {
    max-width: 440px;
    margin-top: 6px;
    color: var(--el-text-color-secondary, #909399);
    font-size: var(--el-font-size-base, 14px);
    line-height: 1.6;
  }

  &__extra {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }

  &__action {
    min-height: 32px;
    padding: 7px 15px;
    border: 1px solid var(--el-border-color, #dcdfe6);
    border-radius: var(--el-border-radius-base, 4px);
    background: var(--el-bg-color-overlay, #fff);
    color: var(--el-text-color-regular, #606266);
    cursor: pointer;
    font: inherit;

    &.is-primary {
      border-color: var(--el-color-primary, #409eff);
      background: var(--el-color-primary, #409eff);
      color: var(--el-color-white, #fff);
    }
  }

  &.is-compact {
    padding: 24px 16px;
  }

  &.is-compact &__image {
    max-width: 80px;
    margin-bottom: 12px;
  }
}
</style>
