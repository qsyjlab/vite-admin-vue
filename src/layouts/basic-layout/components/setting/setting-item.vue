<template>
  <div class="setting-item">
    <div class="setting-item__label">{{ title }}</div>
    <div class="setting-item__content">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
<style lang="scss" scoped>
.setting-item {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  &.is-vertical {
    display: block;

    .setting-item__label {
      margin-bottom: 15px;
    }
  }
}
</style>
