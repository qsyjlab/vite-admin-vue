<template>
  <pro-echarts :options="options" :events="events" />
</template>
<script setup lang="ts">
const events = {
  click: (params: any) => {
    console.log('params', params)
  }
}
const data = [
  {
    count: 4,
    date: '2023-07-31'
  },
  {
    count: 0,
    date: '2023-08-01'
  },
  {
    count: 2,
    date: '2023-08-02'
  },
  {
    count: 0,
    date: '2023-08-03'
  },
  {
    count: 0,
    date: '2023-08-04'
  },
  {
    count: 0,
    date: '2023-08-05'
  },
  {
    count: 0,
    date: '2023-08-06'
  },
  {
    count: 9,
    date: '2023-08-07'
  },
  {
    count: 3,
    date: '2023-08-08'
  },
  {
    count: 0,
    date: '2023-08-09'
  },
  {
    count: 7,
    date: '2023-08-10'
  },
  {
    count: 1,
    date: '2023-08-11'
  },
  {
    count: 0,
    date: '2023-08-12'
  },
  {
    count: 0,
    date: '2023-08-13'
  },
  {
    count: 6,
    date: '2023-08-14'
  },
  {
    count: 4,
    date: '2023-08-15'
  }
]

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
    //   show: true,
  },
  xAxis: {
    type: 'category',
    nameTextStyle: {
      fontSize: 5
    },
    data: data?.map(item => item.date)
  },
  grid: {
    right: '2%',
    left: '2%'
  },
  dataZoom: [
    // {
    //   type: 'slider',
    //   show: true,
    //   xAxisIndex: 0,
    //   // start: 50,
    //   // end:100,
    //   // minValueSpan: 5,
    //   // maxValueSpan: 6,
    //   // width: 12,
    //   height: 5,
    //   // left: "95%",
    //   // borderColor: "#F4F4F4",
    //   // fillerColor: "#E7E7E7",
    //   backgroundColor: '#F4F4F4', //两边未选中的滑动条区域的颜色
    //   showDataShadow: false, //是否显示数据阴影 默认auto
    //   showDetail: false //即拖拽时候是否显示详细数值信息 默认true
    //   // realtime: true, //是否实时更新
    //   // filterMode: "filter",
    //   // handleStyle: {
    //   //   borderRadius: 20
    //   // },
    //   // brushStyle: {
    //   //   brushSelect: false
    //   // }
    // }
  ],
  yAxis: {
    type: 'value',
    splitLine: {
      interval: 0.3
    },
    minInterval: 1
  },
  series: {
    data: data?.map(item => item.count),
    type: 'line',
    smooth: true
  }
}
</script>
