<template>
  <page-wrapper>
    <page-card style="margin-bottom: 20px" header="hooks 方式调用" :full="false">
      <view-statistics></view-statistics>
    </page-card>

    <PageCard header="组件方式调用" :full="false">
      <view-statistics-renderer></view-statistics-renderer>
    </PageCard>
  </page-wrapper>
</template>
<script setup lang="ts">
import ViewStatistics from './charts/view-statistics.vue'
import ViewStatisticsRenderer from './charts/view-statistics-renderer.vue'
</script>
