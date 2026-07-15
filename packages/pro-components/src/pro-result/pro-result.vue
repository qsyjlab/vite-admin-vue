<template>
  <section
    class="pro-result"
    :class="`is-${status}`"
    :style="bodyStyle"
    role="status"
    aria-live="polite"
  >
    <div class="pro-result__icon" aria-hidden="true">
      <slot name="icon">
        <el-icon><component :is="iconComponent" /></el-icon>
      </slot>
    </div>
    <h2 class="pro-result__title">
      <slot name="title">{{ resolvedTitle }}</slot>
    </h2>
    <p v-if="resolvedSubTitle || $slots.subTitle" class="pro-result__subtitle">
      <slot name="subTitle">{{ resolvedSubTitle }}</slot>
    </p>
    <div v-if="$slots.default" class="pro-result__content"><slot /></div>
    <div v-if="hasExtra" class="pro-result__extra">
      <slot name="extra">
        <el-button v-if="primaryText" type="primary" @click="$emit('primary')">
          {{ primaryText }}
        </el-button>
        <el-button v-if="secondaryText" @click="$emit('secondary')">{{ secondaryText }}</el-button>
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  CircleCheckFilled,
  CircleCloseFilled,
  InfoFilled,
  WarningFilled
} from '@element-plus/icons-vue'
import { ElButton, ElIcon } from 'element-plus'
import type { ProResultProps, ProResultSlots } from './pro-result'
import { getProResultDefaultContent } from './pro-result-utils'

defineOptions({ name: 'ProResult' })
const props = withDefaults(defineProps<ProResultProps>(), { status: 'info' })
defineEmits<{ primary: []; secondary: [] }>()
defineSlots<ProResultSlots>()
const slots = useSlots()

const iconComponent = computed(
  () =>
    ({
      success: CircleCheckFilled,
      error: CircleCloseFilled,
      warning: WarningFilled,
      info: InfoFilled,
      '403': WarningFilled,
      '404': InfoFilled,
      '500': CircleCloseFilled
    })[props.status]
)
const defaultContent = computed(() => getProResultDefaultContent(props.status))
const resolvedTitle = computed(() => props.title ?? defaultContent.value.title)
const resolvedSubTitle = computed(() => props.subTitle ?? defaultContent.value.subTitle)
const hasExtra = computed(() => Boolean(slots.extra || props.primaryText || props.secondaryText))
</script>

<style scoped lang="scss">
.pro-result {
  padding: 56px 24px;
  color: var(--el-text-color-primary);
  text-align: center;

  &__icon {
    margin-bottom: 20px;
    color: var(--el-color-info);
    font-size: 72px;
    line-height: 1;
  }

  &.is-success &__icon {
    color: var(--el-color-success);
  }
  &.is-error &__icon,
  &.is-500 &__icon {
    color: var(--el-color-danger);
  }
  &.is-warning &__icon,
  &.is-403 &__icon {
    color: var(--el-color-warning);
  }

  &__title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
  &__subtitle {
    margin: 10px 0 0;
    color: var(--el-text-color-secondary);
    line-height: 1.6;
  }
  &__content {
    max-width: 720px;
    margin: 24px auto 0;
    padding: 20px;
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-light);
    text-align: left;
  }
  &__extra {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 26px;
  }
}
</style>
