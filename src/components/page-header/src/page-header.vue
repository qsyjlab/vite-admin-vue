<template>
  <header class="page-header">
    <div class="page-header__title">
      <div v-if="icon || slots.icon" class="page-header__title-icon">
        <slot name="icon">
          <component :is="icon" />
        </slot>
      </div>
      <div class="page-header__heading">
        <h1>{{ title }}</h1>
        <p v-if="description">{{ description }}</p>
      </div>
    </div>
    <div v-if="slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { useSlots } from 'vue'

defineOptions({
  name: 'GPageHeader'
})

withDefaults(
  defineProps<{
    /** 页面标题 */
    title: string
    /** 标题下的一句话说明 */
    description?: string
    /** 标题左侧的图标组件 */
    icon?: Component
  }>(),
  {}
)

const slots = useSlots()
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 24px;
  background: linear-gradient(
    135deg,
    var(--el-color-primary-light-9),
    var(--el-color-info-light-9)
  );
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);

  &__title {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  &__title-icon {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: var(--global-layout-radius);
    background: linear-gradient(135deg, var(--el-color-primary-light-3), var(--el-color-primary));
    color: #fff;
    box-shadow: 0 6px 16px var(--global-shadow-color);

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__heading {
    min-width: 0;

    h1 {
      margin: 0;
      overflow: hidden;
      font-size: 22px;
      color: var(--el-text-color-primary);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    p {
      margin: 6px 0 0;
      color: var(--el-text-color-secondary);
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex: none;
  }

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;

    &__actions {
      justify-content: flex-start;
    }
  }
}
</style>
