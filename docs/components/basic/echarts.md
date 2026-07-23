# Echarts 图表

基于 echarts 封装的 `ProEcharts` 组件，配合 `useEcharts` hook 使用，自动处理实例初始化、`resize` 与销毁。

## Props

| 属性    | 说明                   | 类型                     | 默认值              |
| ------- | ---------------------- | ------------------------ | ------------------- |
| options | echarts 配置项         | EChartsOption            | {}                  |
| style   | 容器样式               | CSSProperties            | { height: '400px' } |
| events  | 事件绑定，key 为事件名 | Record<string, Function> | {}                  |

## 用法

```vue
<script setup lang="ts">
import { ProEcharts } from '@/components/echarts'
import type { EChartsOption } from 'echarts'

const options: EChartsOption = {
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150, 80, 70] }]
}

const events = {
  click: (params: any) => console.log('click', params)
}
</script>

<template>
  <ProEcharts :options="options" :events="events" />
</template>
```

## useEcharts hook

如需更细粒度的控制，可直接使用 `useEcharts`：

```ts
import { ref } from 'vue'
import { useEcharts } from '@/hooks'

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions, resize, getInstance } = useEcharts(chartRef)

setOptions({
  /* EChartsOption */
})
```

> 详细 API 见源码 `src/hooks/use-echarts.ts` 与 `src/components/echarts/src/echarts.vue`，echarts 按需引入配置见 `src/plugins/echarts.ts`。
