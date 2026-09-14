<template>
  <div ref="viewiewStatisticsRef" style="height: 400px"></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEcharts } from '@/hooks'
import { viewData } from './view-data'

const viewiewStatisticsRef = ref<Nullable<HTMLDivElement>>(null)
const { setOptions } = useEcharts(viewiewStatisticsRef)

onMounted(() => {
  setOptions({
    tooltip: {
      trigger: 'axis',
      formatter: val => {
        const _val = val as unknown as any

        const data = _val[0]
        return `
                <div>${data.name}</div>
                <div>数量: ${data.value}</div>
              `
      }
    },
    xAxis: {
      type: 'category',
      nameTextStyle: {
        fontSize: 5
      },
      data: viewData?.map(item => item.date)
    },
    grid: {
      right: '2%',
      left: '2%'
    },
    yAxis: {
      type: 'value',
      splitLine: {
        interval: 0.3
      },
      minInterval: 1
    },
    series: {
      data: viewData?.map(item => item.count),
      type: 'line',
      smooth: true
    }
  })
})
</script>
