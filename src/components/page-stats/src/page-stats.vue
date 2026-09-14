<template>
  <div class="page-stats" :style="{ '--page-stats-columns': columns }">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'GPageStats'
})

withDefaults(
  defineProps<{
    /** 宽屏下的统计卡列数（窄屏自动降为 2 列/1 列） */
    columns?: number
  }>(),
  {
    columns: 4
  }
)
</script>

<style lang="scss" scoped>
.page-stats {
  display: grid;
  grid-template-columns: repeat(var(--page-stats-columns), minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
