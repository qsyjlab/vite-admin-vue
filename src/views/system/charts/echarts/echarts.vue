<template>
  <page-wrapper class="echarts-page">
    <g-page-header
      title="ECharts"
      description="同一份视图统计数据，分别以 hooks（useEcharts）与组件（ProEcharts）两种方式渲染。"
      :icon="DataLine"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">hooks 方式</el-tag>
        <el-tag effect="plain" type="success">组件方式</el-tag>
      </template>
    </g-page-header>

    <g-page-stats>
      <pro-statistic-card
        title="浏览总量"
        :value="totalViews"
        suffix="次"
        description="统计周期内累计"
      />
      <pro-statistic-card
        title="单日峰值"
        :value="peakItem.count"
        suffix="次"
        :description="peakItem.date"
      />
      <pro-statistic-card
        title="有访问天数"
        :value="activeDays"
        suffix="天"
        :description="`共 ${viewData.length} 天`"
      />
      <pro-statistic-card
        title="日均访问"
        :value="dailyAvg"
        :precision="1"
        suffix="次"
        description="总量 / 统计天数"
      />
    </g-page-stats>

    <pro-card title="hooks 方式调用" subtitle="useEcharts(viewStatisticsRef) 手动 setOptions">
      <view-statistics></view-statistics>
    </pro-card>

    <pro-card title="组件方式调用" subtitle="ProEcharts 声明式传入 options">
      <view-statistics-renderer></view-statistics-renderer>
    </pro-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { DataLine } from '@element-plus/icons-vue'
import { GPageHeader, GPageStats, PageWrapper } from '@/components'
import ViewStatistics from './charts/view-statistics.vue'
import ViewStatisticsRenderer from './charts/view-statistics-renderer.vue'
import { viewData } from './charts/view-data'

const totalViews = viewData.reduce((acc, item) => acc + item.count, 0)
const peakItem = viewData.reduce((max, item) => (item.count > max.count ? item : max), viewData[0])
const activeDays = viewData.filter(item => item.count > 0).length
const dailyAvg = totalViews / viewData.length
</script>
<style scoped lang="scss">
.echarts-page {
  gap: 16px;
}
</style>
