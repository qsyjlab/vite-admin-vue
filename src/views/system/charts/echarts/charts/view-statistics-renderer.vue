<template>
  <pro-echarts :options="options" :events="events" />
</template>
<script setup lang="ts">
import { viewData } from './view-data'

const events = {
  click: (params: any) => {
    console.log('params', params)
  }
}

const options = {
  tooltip: {
    trigger: 'axis',
    formatter: (val: any) => {
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
}
</script>
