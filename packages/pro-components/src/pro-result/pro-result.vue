<template>
  <section class="pro-result" :class="`is-${status}`" :style="bodyStyle" role="status">
    <div class="pro-result__icon">
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

defineOptions({ name: 'ProResult' })
const props = withDefaults(defineProps<ProResultProps>(), { status: 'info' })
defineEmits<{ primary: []; secondary: [] }>()
defineSlots<ProResultSlots>()
const slots = useSlots()

const meta = computed(
  () =>
    ({
      success: [CircleCheckFilled, '操作成功', '请求已经成功完成'],
      error: [CircleCloseFilled, '操作失败', '请求处理失败，请稍后重试'],
      warning: [WarningFilled, '需要注意', '请检查相关信息后继续'],
      info: [InfoFilled, '提示信息', '请根据提示继续操作'],
      '403': [WarningFilled, '403', '抱歉，你无权访问此页面'],
      '404': [InfoFilled, '404', '抱歉，你访问的页面不存在'],
      '500': [CircleCloseFilled, '500', '服务器发生错误，请稍后重试']
    })[props.status]
)
const iconComponent = computed(() => meta.value[0])
const resolvedTitle = computed(() => props.title ?? meta.value[1])
const resolvedSubTitle = computed(() => props.subTitle ?? meta.value[2])
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
