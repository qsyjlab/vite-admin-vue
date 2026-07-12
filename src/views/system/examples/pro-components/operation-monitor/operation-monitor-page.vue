<template>
  <page-wrapper class="monitor-page">
    <header class="monitor-page__header">
      <div class="monitor-page__title">
        <div class="monitor-page__title-icon">
          <DataAnalysis />
        </div>
        <div>
          <h1>运营监控中心</h1>
          <p>整合 ProStatisticCard、ProCard、ECharts 与 ProTable，呈现一个完整的监控大盘。</p>
        </div>
      </div>
      <div class="monitor-page__controls">
        <el-segmented v-model="range" :options="rangeOptions" size="small" />
        <el-button :icon="Refresh" size="small" @click="refreshAll">刷新</el-button>
        <el-tag effect="plain" type="success">
          <span class="live-dot"></span>
          实时
        </el-tag>
      </div>
    </header>

    <div class="monitor-page__statistics">
      <pro-statistic-card
        title="今日访问量"
        :value="summary.visits"
        suffix="次"
        trend="up"
        trend-value="12.8%"
        description="较昨日 +1,284"
      />
      <pro-statistic-card
        title="活跃用户"
        :value="summary.activeUsers"
        suffix="人"
        trend="up"
        trend-value="6.2%"
        description="在线峰值 1,420"
      />
      <pro-statistic-card
        title="订单转化"
        :value="summary.conversion"
        :precision="2"
        suffix="%"
        trend="down"
        trend-value="0.6%"
        description="需关注支付环节"
      />
      <pro-statistic-card
        title="系统告警"
        :value="summary.alerts"
        suffix="条"
        trend="up"
        trend-value="3"
        description="2 条待处理"
      />
    </div>

    <div class="monitor-page__charts">
      <pro-card
        title="访问趋势"
        subtitle="近 7 天访问与下单数据"
        class="chart-card chart-card--wide"
      >
        <template #extra>
          <el-radio-group v-model="trendMetric" size="small">
            <el-radio-button value="visits">访问</el-radio-button>
            <el-radio-button value="orders">下单</el-radio-button>
          </el-radio-group>
        </template>
        <pro-echarts :options="trendOptions" :style="{ height: '320px' }" />
      </pro-card>

      <pro-card title="流量来源" subtitle="渠道占比" class="chart-card">
        <pro-echarts :options="sourceOptions" :style="{ height: '320px' }" />
      </pro-card>
    </div>

    <div class="monitor-page__charts">
      <pro-card title="业务能力雷达" subtitle="多维度评分" class="chart-card">
        <pro-echarts :options="radarOptions" :style="{ height: '320px' }" />
      </pro-card>

      <pro-card title="区域订单分布" subtitle="Top 6 城市" class="chart-card">
        <pro-echarts :options="barOptions" :style="{ height: '320px' }" />
      </pro-card>

      <pro-card title="设备分布" subtitle="终端类型" class="chart-card">
        <pro-echarts :options="deviceOptions" :style="{ height: '320px' }" />
      </pro-card>
    </div>

    <pro-card
      title="实时告警"
      subtitle="服务端分页与状态筛选"
      :body-padding="false"
      class="alert-card"
    >
      <template #extra>
        <el-button link type="primary" @click="clearAlertSelection">清空选择</el-button>
      </template>
      <div class="alert-toolbar">
        <span>已选择 {{ alertSelectedKeys.length }} 条告警</span>
        <div>
          <el-button :disabled="!alertSelectedKeys.length" @click="batchResolve"
            >批量处理</el-button
          >
          <el-button :icon="RefreshRight" :disabled="alertLoading" @click="reloadAlerts">
            重新加载
          </el-button>
        </div>
      </div>
      <pro-table
        ref="alertTableRef"
        v-model:selected-keys="alertSelectedKeys"
        :columns="alertColumns"
        :request="getAlertPage"
        :params="alertParams"
        :pagination="{ pageSize: 8, pageSizes: [8, 16, 32] }"
        row-key="id"
        checkable
        reserve-selection
        header-title="告警列表"
        @update:loading="alertLoading = $event"
        @request-error="handleAlertError"
      >
        <template #operation="{ row }">
          <el-button link type="primary" @click="resolveAlert(row)">处理</el-button>
        </template>
      </pro-table>
    </pro-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { DataAnalysis, Refresh, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { PageWrapper } from '@/components'
import { ProEcharts } from '@/components/echarts'
import {
  ProCard,
  ProStatisticCard,
  ProTable,
  useProTable,
  type ProTableColumns,
  type ProTableInstance,
  type ProTableRequestParams,
  type ProTableRequestResult
} from '@vite-admin/pro-components'

defineOptions({ name: 'OperationMonitorPage' })

type RangeKey = '7d' | '30d' | '90d'
type TrendMetric = 'visits' | 'orders'

const range = ref<RangeKey>('7d')
const trendMetric = ref<TrendMetric>('visits')
const rangeOptions = [
  { label: '近 7 天', value: '7d' },
  { label: '近 30 天', value: '30d' },
  { label: '近 90 天', value: '90d' }
]

const summary = ref({
  visits: 12860,
  activeUsers: 3482,
  conversion: 6.84,
  alerts: 18
})

const trendDatasets: Record<RangeKey, { visits: number[]; orders: number[]; labels: string[] }> = {
  '7d': {
    visits: [1820, 1942, 1680, 2150, 2380, 2680, 1280],
    orders: [128, 142, 118, 168, 192, 224, 96],
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  '30d': {
    visits: Array.from({ length: 30 }, (_, i) => 1500 + Math.round(Math.sin(i / 3) * 600) + i * 30),
    orders: Array.from({ length: 30 }, (_, i) => 100 + Math.round(Math.cos(i / 4) * 40) + i * 2),
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
  },
  '90d': {
    visits: Array.from(
      { length: 12 },
      (_, i) => 20000 + Math.round(Math.sin(i / 2) * 5000) + i * 800
    ),
    orders: Array.from({ length: 12 }, (_, i) => 1600 + Math.round(Math.cos(i / 2) * 320) + i * 40),
    labels: Array.from({ length: 12 }, (_, i) => `第${i + 1}周`)
  }
}

const trendOptions = computed(() => {
  const dataset = trendDatasets[range.value]
  const data = trendMetric.value === 'visits' ? dataset.visits : dataset.orders
  const color = trendMetric.value === 'visits' ? '#409eff' : '#67c23a'
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: [trendMetric.value === 'visits' ? '访问量' : '下单量'], top: 4 },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: dataset.labels },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
    series: [
      {
        name: trendMetric.value === 'visits' ? '访问量' : '下单量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data,
        lineStyle: { width: 3, color },
        itemStyle: { color },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${color}66` },
              { offset: 1, color: `${color}05` }
            ]
          }
        }
      }
    ]
  }
})

const sourceOptions = {
  tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', left: 'left', top: 'middle' },
  series: [
    {
      name: '流量来源',
      type: 'pie',
      radius: ['45%', '72%'],
      center: ['62%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false, position: 'center' },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      labelLine: { show: false },
      data: [
        { value: 3480, name: '搜索引擎', itemStyle: { color: '#409eff' } },
        { value: 2120, name: '直接访问', itemStyle: { color: '#67c23a' } },
        { value: 1680, name: '社交媒体', itemStyle: { color: '#e6a23c' } },
        { value: 920, name: '外部链接', itemStyle: { color: '#f56c6c' } },
        { value: 660, name: '广告投放', itemStyle: { color: '#909399' } }
      ]
    }
  ]
}

const radarOptions = {
  tooltip: {},
  radar: {
    indicator: [
      { name: '可用性', max: 100 },
      { name: '响应速度', max: 100 },
      { name: '吞吐量', max: 100 },
      { name: '错误率', max: 100 },
      { name: '资源占用', max: 100 },
      { name: '安全评分', max: 100 }
    ],
    radius: '65%',
    splitArea: { areaStyle: { color: ['rgba(64,158,255,0.05)', 'rgba(64,158,255,0.1)'] } }
  },
  series: [
    {
      name: '能力评分',
      type: 'radar',
      data: [
        {
          value: [96, 88, 92, 78, 85, 94],
          name: '本月',
          areaStyle: { color: 'rgba(64,158,255,0.25)' },
          lineStyle: { color: '#409eff', width: 2 },
          itemStyle: { color: '#409eff' }
        },
        {
          value: [90, 82, 86, 84, 80, 88],
          name: '上月',
          areaStyle: { color: 'rgba(103,194,58,0.18)' },
          lineStyle: { color: '#67c23a', width: 2 },
          itemStyle: { color: '#67c23a' }
        }
      ]
    }
  ]
}

const barOptions = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['北京', '上海', '深圳', '广州', '杭州', '成都'] },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
  series: [
    {
      name: '订单数',
      type: 'bar',
      data: [3480, 3260, 2940, 2680, 2120, 1860],
      barWidth: '46%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#1677ff' }
          ]
        }
      }
    }
  ]
}

const deviceOptions = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, left: 'center' },
  series: [
    {
      name: '设备分布',
      type: 'pie',
      radius: ['38%', '62%'],
      center: ['50%', '42%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { formatter: '{b}\n{d}%' },
      data: [
        { value: 5240, name: '移动端', itemStyle: { color: '#409eff' } },
        { value: 3180, name: '桌面端', itemStyle: { color: '#67c23a' } },
        { value: 760, name: '平板', itemStyle: { color: '#e6a23c' } },
        { value: 240, name: '其他', itemStyle: { color: '#909399' } }
      ]
    }
  ]
}

interface AlertRecord {
  id: number
  level: 'critical' | 'warning' | 'info'
  source: string
  message: string
  status: 'pending' | 'processing' | 'resolved'
  occurredAt: string
}

const alertValueEnum = {
  level: {
    critical: { text: '严重', type: 'danger' },
    warning: { text: '警告', type: 'warning' },
    info: { text: '提示', type: 'info' }
  } as const,
  status: {
    pending: { text: '待处理', type: 'danger' },
    processing: { text: '处理中', type: 'warning' },
    resolved: { text: '已解决', type: 'success' }
  } as const
}

const alertSources = ['订单服务', '支付网关', '用户中心', '库存服务', '消息推送', '风控引擎']
const alertMessages = [
  '接口响应时间超过阈值 800ms',
  '连接池使用率达到 85%',
  '检测到异常登录行为',
  '库存同步任务执行失败',
  '消息队列积压超过 1000 条',
  '风控规则触发率异常上升'
]
const alertLevels: AlertRecord['level'][] = ['critical', 'warning', 'info']
const alertStatuses: AlertRecord['status'][] = ['pending', 'processing', 'resolved']

const alertRecords: AlertRecord[] = Array.from({ length: 26 }, (_, index) => ({
  id: index + 1,
  level: alertLevels[index % alertLevels.length],
  source: alertSources[index % alertSources.length],
  message: alertMessages[index % alertMessages.length],
  status: alertStatuses[index % alertStatuses.length],
  occurredAt: `2026-07-${String(12 - (index % 7)).padStart(2, '0')} ${String(8 + (index % 12)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}:00`
}))

const alertSelectedKeys = ref<Array<string | number>>([])
const alertLoading = ref(false)
const alertParams = ref<Record<string, never>>({})
const alertTableRef = useTemplateRef<ProTableInstance<AlertRecord>>('alertTableRef')
const alertTable = useProTable<AlertRecord>(alertTableRef)

const alertColumns: ProTableColumns<AlertRecord> = [
  {
    key: 'level',
    dataIndex: 'level',
    title: '级别',
    width: 100,
    valueType: 'status',
    valueEnum: alertValueEnum.level
  },
  { key: 'source', dataIndex: 'source', title: '告警来源', width: 140 },
  { key: 'message', dataIndex: 'message', title: '告警内容', minWidth: 280 },
  {
    key: 'status',
    dataIndex: 'status',
    title: '状态',
    width: 110,
    valueType: 'status',
    valueEnum: alertValueEnum.status
  },
  {
    key: 'occurred-at',
    dataIndex: 'occurredAt',
    title: '发生时间',
    width: 180,
    valueType: 'datetime'
  },
  { key: 'operation', title: '操作', width: 90, fixed: 'right' }
]

async function getAlertPage(
  params: ProTableRequestParams<Record<string, never>>
): Promise<ProTableRequestResult<AlertRecord>> {
  await new Promise(resolve => setTimeout(resolve, 220))
  const start = (params.current - 1) * params.pageSize
  return {
    data: alertRecords.slice(start, start + params.pageSize),
    total: alertRecords.length,
    success: true
  }
}

function handleAlertError() {
  ElMessage.error('告警列表加载失败')
}

async function reloadAlerts() {
  await alertTable.reload(false)
  ElMessage.success('告警列表已刷新')
}

async function clearAlertSelection() {
  await alertTable.clearSelection()
}

function resolveAlert(row: AlertRecord) {
  ElMessage.success(`告警 ${row.id} 已标记为处理中`)
}

function batchResolve() {
  ElMessage.success(`已批量处理 ${alertSelectedKeys.value.length} 条告警`)
}

function refreshAll() {
  summary.value = {
    visits: 12860 + Math.round(Math.random() * 200),
    activeUsers: 3482 + Math.round(Math.random() * 80),
    conversion: Number((6.84 + (Math.random() - 0.5) * 0.6).toFixed(2)),
    alerts: 18 + Math.round(Math.random() * 4)
  }
  void reloadAlerts()
}
</script>

<style scoped lang="scss">
.monitor-page {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 24px;
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-9),
      var(--el-color-warning-light-9)
    );
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;

    h1 {
      margin: 0;
      font-size: 22px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 6px 0 0;
      color: var(--el-text-color-secondary);
    }
  }

  &__title-icon {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: var(--global-layout-radius);
    background: linear-gradient(135deg, #409eff, #1677ff);
    color: #fff;
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.32);

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: none;
  }

  &__statistics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  &__charts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}

.live-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 4px;
  border-radius: 50%;
  background: var(--el-color-success);
  animation: live-pulse 1.6s ease-in-out infinite;
}

@keyframes live-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.6);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(103, 194, 58, 0);
  }
}

.chart-card {
  min-width: 0;

  &--wide {
    grid-column: 1 / span 2;
  }
}

.alert-card {
  :deep(.pro-table) {
    min-height: 0;
  }
}

.alert-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 1200px) {
  .monitor-page__charts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .chart-card--wide {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .monitor-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .monitor-page__statistics,
  .monitor-page__charts {
    grid-template-columns: 1fr;
  }

  .alert-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
