<template>
  <page-wrapper :full="false" class="workbench-page">
    <header class="workbench-header">
      <div>
        <p class="workbench-date">{{ formattedDate }}</p>
        <h1>工作台</h1>
        <p class="workbench-greeting">上午好，管理员。这里是今天需要关注的业务进展。</p>
      </div>
      <div class="workbench-header__actions">
        <el-button :icon="Refresh" @click="refreshDashboard">刷新数据</el-button>
        <el-button type="primary" :icon="Plus" @click="goToRoute('ProFormBase')">
          新建任务
        </el-button>
      </div>
    </header>

    <section class="metric-grid" aria-label="核心指标">
      <article v-for="item in metrics" :key="item.label" class="metric-card">
        <div class="metric-card__top">
          <span class="metric-card__label">{{ item.label }}</span>
          <span class="metric-card__icon" :style="{ color: item.color, background: item.bg }">
            <component :is="item.icon" />
          </span>
        </div>
        <strong class="metric-card__value">{{ item.value }}</strong>
        <div class="metric-card__footer">
          <span :class="['metric-card__trend', item.positive ? 'is-up' : 'is-down']">
            <el-icon><TopRight v-if="item.positive" /><BottomRight v-else /></el-icon>
            {{ item.change }}
          </span>
          <span>较昨日</span>
        </div>
      </article>
    </section>

    <section class="workbench-grid workbench-grid--primary">
      <article class="workbench-panel trend-panel">
        <div class="panel-heading">
          <div>
            <h2>经营趋势</h2>
            <p>收入与订单量变化</p>
          </div>
          <el-segmented v-model="trendPeriod" :options="periodOptions" size="small" />
        </div>
        <div class="trend-summary">
          <div>
            <span>周期收入</span>
            <strong>{{ currentTrend.total }}</strong>
          </div>
          <div>
            <span>订单数量</span>
            <strong>{{ currentTrend.orders }} <small>笔</small></strong>
          </div>
          <div>
            <span>转化率</span>
            <strong>{{ currentTrend.conversion }}</strong>
          </div>
        </div>
        <pro-echarts class="trend-chart" :style="{ height: '278px' }" :options="chartOptions" />
      </article>

      <article class="workbench-panel todo-panel">
        <div class="panel-heading">
          <div>
            <h2>今日待办</h2>
            <p>{{ unfinishedTodoCount }} 项尚未完成</p>
          </div>
          <el-button text type="primary" @click="goToRoute('ProTableBasic')">查看全部</el-button>
        </div>

        <div class="todo-list">
          <label
            v-for="todo in todos"
            :key="todo.id"
            :class="['todo-item', { 'is-done': todo.done }]"
          >
            <el-checkbox v-model="todo.done" :aria-label="`完成${todo.title}`" />
            <span class="todo-item__content">
              <strong>{{ todo.title }}</strong>
              <small>
                <el-icon><Clock /></el-icon>
                {{ todo.time }}
              </small>
            </span>
            <span :class="['priority-tag', `is-${todo.priority}`]">
              {{ priorityLabels[todo.priority] }}
            </span>
          </label>
        </div>

        <button class="todo-add" type="button" @click="addTodo">
          <el-icon><Plus /></el-icon>
          添加待办
        </button>
      </article>
    </section>

    <section class="quick-actions" aria-label="快捷操作">
      <button
        v-for="action in quickActions"
        :key="action.label"
        type="button"
        @click="goToRoute(action.routeName)"
      >
        <span :style="{ color: action.color, background: action.bg }">
          <component :is="action.icon" />
        </span>
        <strong>{{ action.label }}</strong>
        <small>{{ action.description }}</small>
        <el-icon class="quick-actions__arrow"><ArrowRight /></el-icon>
      </button>
    </section>

    <section class="workbench-grid workbench-grid--secondary">
      <article class="workbench-panel order-panel">
        <div class="panel-heading">
          <div>
            <h2>最近订单</h2>
            <p>最新业务订单与处理状态</p>
          </div>
          <el-button text type="primary" @click="goToRoute('ProTableBasic')">订单管理</el-button>
        </div>

        <div class="order-table">
          <div class="order-table__row order-table__head">
            <span>订单号</span>
            <span>客户</span>
            <span>金额</span>
            <span>状态</span>
          </div>
          <div v-for="order in orders" :key="order.no" class="order-table__row">
            <span class="order-no">{{ order.no }}</span>
            <span class="order-customer">
              <i :style="{ background: order.avatarColor }">{{ order.customer.slice(0, 1) }}</i>
              {{ order.customer }}
            </span>
            <strong>{{ order.amount }}</strong>
            <span
              ><el-tag :type="order.statusType" effect="light">{{ order.status }}</el-tag></span
            >
          </div>
        </div>
      </article>

      <article class="workbench-panel activity-panel">
        <div class="panel-heading">
          <div>
            <h2>业务动态</h2>
            <p>团队最新操作记录</p>
          </div>
          <el-button :icon="MoreFilled" text circle aria-label="更多动态" />
        </div>

        <div class="activity-list">
          <div v-for="activity in activities" :key="activity.title" class="activity-item">
            <span class="activity-item__dot" :style="{ background: activity.color }"></span>
            <div>
              <p>
                <strong>{{ activity.user }}</strong> {{ activity.title }}
              </p>
              <span>{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </article>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { computed, markRaw, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowRight,
  BottomRight,
  Calendar,
  CircleCheck,
  Clock,
  Coin,
  DataAnalysis,
  Document,
  Goods,
  MoreFilled,
  Plus,
  Refresh,
  ShoppingCart,
  Tickets,
  TopRight,
  User
} from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { PageWrapper } from '@/components/page-wrapper'
import { ProEcharts } from '@/components/echarts'
import { useLayoutStore } from '@/store'

type TrendPeriod = '今日' | '本周' | '本月'
type Priority = 'high' | 'medium' | 'normal'

const router = useRouter()
const { layoutConfig } = storeToRefs(useLayoutStore())
const trendPeriod = ref<TrendPeriod>('本周')
const periodOptions: TrendPeriod[] = ['今日', '本周', '本月']

const formattedDate = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
}).format(new Date())

const metrics = [
  {
    label: '待处理订单',
    value: '18',
    change: '12.5%',
    positive: true,
    icon: markRaw(ShoppingCart),
    color: '#1677ff',
    bg: 'rgba(22, 119, 255, 0.12)'
  },
  {
    label: '今日收入',
    value: '¥28,640',
    change: '8.2%',
    positive: true,
    icon: markRaw(Coin),
    color: '#16a34a',
    bg: 'rgba(22, 163, 74, 0.12)'
  },
  {
    label: '活跃客户',
    value: '1,284',
    change: '5.7%',
    positive: true,
    icon: markRaw(User),
    color: '#0891b2',
    bg: 'rgba(8, 145, 178, 0.12)'
  },
  {
    label: '本月完成率',
    value: '86.4%',
    change: '3.1%',
    positive: true,
    icon: markRaw(CircleCheck),
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.12)'
  }
]

const trendData: Record<
  TrendPeriod,
  {
    labels: string[]
    income: number[]
    ordersSeries: number[]
    total: string
    orders: number
    conversion: string
  }
> = {
  今日: {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    income: [2.8, 4.6, 7.2, 6.4, 9.1, 8.7],
    ordersSeries: [12, 18, 25, 23, 31, 29],
    total: '¥28,640',
    orders: 138,
    conversion: '18.6%'
  },
  本周: {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    income: [18, 24, 21, 32, 29, 38, 42],
    ordersSeries: [76, 92, 84, 118, 107, 136, 148],
    total: '¥204,680',
    orders: 761,
    conversion: '21.4%'
  },
  本月: {
    labels: ['第1周', '第2周', '第3周', '第4周'],
    income: [138, 162, 186, 205],
    ordersSeries: [520, 612, 704, 761],
    total: '¥691,420',
    orders: 2597,
    conversion: '22.8%'
  }
}

const currentTrend = computed(() => trendData[trendPeriod.value])

const chartOptions = computed(() => {
  const dark = layoutConfig.value.theme === 'dark'
  const textColor = dark ? 'rgba(255,255,255,0.58)' : 'rgba(0,0,0,0.45)'
  const splitColor = dark ? '#303030' : '#edf0f4'
  const data = currentTrend.value

  return {
    animationDuration: 500,
    color: ['#1677ff', '#16a34a'],
    tooltip: { trigger: 'axis' },
    legend: {
      right: 4,
      top: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: textColor }
    },
    grid: { left: 12, right: 18, top: 42, bottom: 8, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.labels,
      axisLine: { lineStyle: { color: splitColor } },
      axisTick: { show: false },
      axisLabel: { color: textColor }
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: { color: textColor, formatter: '{value}k' },
        splitLine: { lineStyle: { color: splitColor, type: 'dashed' } }
      },
      {
        type: 'value',
        axisLabel: { color: textColor },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '收入（千元）',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: data.income,
        lineStyle: { width: 3 },
        areaStyle: { color: dark ? 'rgba(22,119,255,0.12)' : 'rgba(22,119,255,0.08)' }
      },
      {
        name: '订单量',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'none',
        data: data.ordersSeries,
        lineStyle: { width: 2, type: 'dashed' }
      }
    ]
  }
})

const todos = reactive([
  { id: 1, title: '审核华东区采购申请', time: '09:30', priority: 'high' as Priority, done: false },
  { id: 2, title: '确认七月营销预算', time: '11:00', priority: 'medium' as Priority, done: false },
  {
    id: 3,
    title: '回复重点客户续约方案',
    time: '14:00',
    priority: 'high' as Priority,
    done: false
  },
  {
    id: 4,
    title: '检查本周服务质量报告',
    time: '16:30',
    priority: 'normal' as Priority,
    done: true
  }
])

const priorityLabels: Record<Priority, string> = {
  high: '高优先级',
  medium: '中优先级',
  normal: '普通'
}
const unfinishedTodoCount = computed(() => todos.filter(item => !item.done).length)

const quickActions = [
  {
    label: '创建订单',
    description: '录入新的销售订单',
    routeName: 'ProFormBase',
    icon: markRaw(Goods),
    color: '#1677ff',
    bg: 'rgba(22,119,255,.1)'
  },
  {
    label: '客户档案',
    description: '查询客户与联系人',
    routeName: 'ProTableBasic',
    icon: markRaw(User),
    color: '#0891b2',
    bg: 'rgba(8,145,178,.1)'
  },
  {
    label: '经营报表',
    description: '查看收入分析报表',
    routeName: 'Echarts',
    icon: markRaw(DataAnalysis),
    color: '#16a34a',
    bg: 'rgba(22,163,74,.1)'
  },
  {
    label: '审批中心',
    description: '处理待审业务单据',
    routeName: 'ProTableBasic',
    icon: markRaw(Tickets),
    color: '#d97706',
    bg: 'rgba(217,119,6,.1)'
  },
  {
    label: '工作日历',
    description: '安排团队工作计划',
    routeName: 'ProTableBasic',
    icon: markRaw(Calendar),
    color: '#7c3aed',
    bg: 'rgba(124,58,237,.1)'
  },
  {
    label: '业务文档',
    description: '维护常用资料文档',
    routeName: 'ProTableBasic',
    icon: markRaw(Document),
    color: '#dc2626',
    bg: 'rgba(220,38,38,.1)'
  }
]

const orders = [
  {
    no: 'SO-20260710-018',
    customer: '上海云启科技',
    amount: '¥12,860',
    status: '待审核',
    statusType: 'warning' as const,
    avatarColor: '#1677ff'
  },
  {
    no: 'SO-20260710-017',
    customer: '杭州星澜网络',
    amount: '¥8,420',
    status: '处理中',
    statusType: 'primary' as const,
    avatarColor: '#0891b2'
  },
  {
    no: 'SO-20260710-016',
    customer: '深圳远帆数字',
    amount: '¥21,600',
    status: '已完成',
    statusType: 'success' as const,
    avatarColor: '#16a34a'
  },
  {
    no: 'SO-20260710-015',
    customer: '北京启明咨询',
    amount: '¥6,980',
    status: '待付款',
    statusType: 'danger' as const,
    avatarColor: '#d97706'
  }
]

const activities = [
  {
    user: '李敏',
    title: '完成了订单 SO-20260710-016 的出库审核',
    time: '10 分钟前',
    color: '#16a34a'
  },
  { user: '王凯', title: '提交了华东区七月采购申请', time: '36 分钟前', color: '#1677ff' },
  { user: '系统', title: '生成了本周服务质量分析报告', time: '1 小时前', color: '#d97706' },
  { user: '陈晨', title: '更新了重点客户续约跟进记录', time: '2 小时前', color: '#7c3aed' }
]

function goToRoute(name: string) {
  if (router.hasRoute(name)) {
    router.push({ name })
  } else {
    ElMessage.info('该功能示例暂未启用')
  }
}

function refreshDashboard() {
  ElMessage.success('工作台数据已更新')
}

function addTodo() {
  const id = todos.length + 1
  todos.push({ id, title: `新增待办事项 ${id}`, time: '17:30', priority: 'normal', done: false })
}
</script>

<style lang="scss" scoped>
.workbench-page {
  color: var(--global-text-color-regular);
}

.workbench-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 16px;
  padding: 20px 22px;
  border: 1px solid var(--global-border-color);
  border-radius: 8px;
  background: var(--global-surface-color);
  box-shadow: 0 1px 3px var(--global-shadow-color);

  h1 {
    margin: 3px 0 4px;
    color: var(--global-heading-color);
    font-size: 26px;
    line-height: 1.35;
    letter-spacing: 0;
  }
}

.workbench-date,
.workbench-greeting {
  margin: 0;
  color: var(--global-text-color-secondary);
}

.workbench-date {
  font-size: 13px;
}

.workbench-header__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.metric-card,
.workbench-panel,
.quick-actions {
  border: 1px solid var(--global-border-color);
  border-radius: 8px;
  background: var(--global-surface-color);
  box-shadow: 0 1px 3px var(--global-shadow-color);
}

.metric-card {
  min-width: 0;
  padding: 18px 20px;
}

.metric-card__top,
.metric-card__footer {
  display: flex;
  align-items: center;
}

.metric-card__top {
  justify-content: space-between;
  gap: 12px;
}

.metric-card__label,
.metric-card__footer {
  color: var(--global-text-color-secondary);
}

.metric-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 7px;

  :deep(svg) {
    width: 19px;
    height: 19px;
  }
}

.metric-card__value {
  display: block;
  margin: 10px 0 8px;
  color: var(--global-heading-color);
  font-size: 27px;
  line-height: 1.25;
  white-space: nowrap;
}

.metric-card__footer {
  gap: 6px;
  font-size: 12px;
}

.metric-card__trend {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-weight: 600;

  &.is-up {
    color: #16a34a;
  }

  &.is-down {
    color: #dc2626;
  }
}

.workbench-grid {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}

.workbench-grid--primary {
  grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.85fr);
}

.workbench-grid--secondary {
  grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.8fr);
}

.workbench-panel {
  min-width: 0;
  padding: 20px;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  h2 {
    margin: 0;
    color: var(--global-heading-color);
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 0;
  }

  p {
    margin: 3px 0 0;
    color: var(--global-text-color-secondary);
    font-size: 12px;
  }
}

.trend-summary {
  display: flex;
  gap: 36px;
  margin-top: 18px;

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  span {
    color: var(--global-text-color-secondary);
    font-size: 12px;
  }

  strong {
    color: var(--global-heading-color);
    font-size: 20px;
  }

  small {
    font-size: 12px;
    font-weight: 400;
  }
}

.trend-chart {
  width: 100%;
  margin-top: 4px;
}

.todo-list {
  margin-top: 14px;
}

.todo-item {
  display: flex;
  align-items: center;
  min-height: 58px;
  gap: 10px;
  border-bottom: 1px solid var(--global-border-color);
  cursor: pointer;

  &.is-done {
    .todo-item__content strong {
      color: var(--global-text-color-placeholder);
      text-decoration: line-through;
    }
  }
}

.todo-item__content {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 3px;

  strong {
    overflow: hidden;
    color: var(--global-text-color-regular);
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--global-text-color-secondary);
  }
}

.priority-tag {
  padding: 2px 7px;
  flex-shrink: 0;
  border-radius: 4px;
  font-size: 11px;

  &.is-high {
    color: #dc2626;
    background: rgba(220, 38, 38, 0.1);
  }

  &.is-medium {
    color: #d97706;
    background: rgba(217, 119, 6, 0.1);
  }

  &.is-normal {
    color: var(--global-text-color-secondary);
    background: var(--global-surface-color-muted);
  }
}

.todo-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 34px;
  gap: 6px;
  margin-top: 12px;
  border: 1px dashed var(--global-border-color-strong);
  border-radius: 6px;
  color: var(--global-text-color-secondary);
  background: transparent;
  cursor: pointer;

  &:hover {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
    background: var(--global-hover-color);
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  margin-top: 16px;
  overflow: hidden;

  button {
    position: relative;
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    grid-template-rows: auto auto;
    column-gap: 10px;
    min-width: 0;
    padding: 16px;
    border: 0;
    border-right: 1px solid var(--global-border-color);
    text-align: left;
    color: inherit;
    background: transparent;
    cursor: pointer;

    &:last-child {
      border-right: 0;
    }

    &:hover {
      background: var(--global-hover-color);

      .quick-actions__arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }

    > span {
      display: inline-flex;
      grid-row: 1 / 3;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 7px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    strong,
    small {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    strong {
      color: var(--global-heading-color);
      font-size: 13px;
    }

    small {
      color: var(--global-text-color-secondary);
      font-size: 11px;
    }
  }
}

.quick-actions__arrow {
  position: absolute;
  top: 10px;
  right: 8px;
  color: var(--global-text-color-secondary);
  opacity: 0;
  transform: translateX(-4px);
  transition: 0.16s ease;
}

.order-table {
  margin-top: 14px;
  overflow-x: auto;
}

.order-table__row {
  display: grid;
  grid-template-columns: 1.25fr 1.35fr 0.7fr 0.6fr;
  align-items: center;
  min-width: 660px;
  min-height: 54px;
  gap: 14px;
  border-bottom: 1px solid var(--global-border-color);
  font-size: 13px;

  &:last-child {
    border-bottom: 0;
  }
}

.order-table__head {
  min-height: 38px;
  color: var(--global-text-color-secondary);
  background: var(--global-surface-color-muted);

  span:first-child {
    padding-left: 10px;
  }
}

.order-no {
  padding-left: 10px;
  color: var(--el-color-primary);
  font-variant-numeric: tabular-nums;
}

.order-customer {
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
    font-style: normal;
  }
}

.activity-list {
  margin-top: 17px;
}

.activity-item {
  position: relative;
  display: flex;
  min-height: 58px;
  gap: 12px;
  padding-bottom: 12px;

  &::before {
    content: '';
    position: absolute;
    top: 15px;
    bottom: -2px;
    left: 4px;
    width: 1px;
    background: var(--global-border-color);
  }

  &:last-child::before {
    display: none;
  }

  p {
    margin: 0 0 5px;
    color: var(--global-text-color-regular);
    font-size: 13px;
    line-height: 1.55;
  }

  span {
    color: var(--global-text-color-secondary);
    font-size: 12px;
  }
}

.activity-item__dot {
  position: relative;
  z-index: 1;
  width: 9px;
  height: 9px;
  margin-top: 6px;
  flex-shrink: 0;
  border: 2px solid var(--global-surface-color);
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--global-border-color);
}

:global(html.dark) {
  .metric-card__trend.is-up {
    color: #4ade80;
  }

  .metric-card__trend.is-down {
    color: #f87171;
  }
}

@media (max-width: 1180px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .workbench-grid--primary,
  .workbench-grid--secondary {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    button:nth-child(3) {
      border-right: 0;
    }

    button:nth-child(-n + 3) {
      border-bottom: 1px solid var(--global-border-color);
    }
  }
}

@media (max-width: 767px) {
  .workbench-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 10px;
    padding: 16px 14px;

    h1 {
      font-size: 22px;
    }
  }

  .workbench-header__actions {
    width: 100%;

    :deep(.el-button) {
      flex: 1;
      margin: 0;
    }
  }

  .metric-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .metric-card {
    padding: 14px;
  }

  .metric-card__icon {
    width: 32px;
    height: 32px;
  }

  .metric-card__value {
    font-size: 21px;
  }

  .workbench-grid {
    gap: 10px;
    margin-top: 10px;
  }

  .workbench-panel {
    padding: 16px 14px;
  }

  .panel-heading {
    align-items: center;
  }

  .trend-summary {
    justify-content: space-between;
    gap: 10px;

    strong {
      font-size: 17px;
    }
  }

  .quick-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 10px;

    button {
      border-right: 1px solid var(--global-border-color);
      border-bottom: 1px solid var(--global-border-color);
    }

    button:nth-child(2n) {
      border-right: 0;
    }

    button:nth-last-child(-n + 2) {
      border-bottom: 0;
    }
  }
}

@media (max-width: 420px) {
  .metric-grid {
    grid-template-columns: 1fr;
  }

  .metric-card {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;

    .metric-card__top {
      display: contents;
    }

    .metric-card__icon {
      grid-column: 2;
      grid-row: 1 / 3;
      align-self: center;
    }

    .metric-card__value {
      margin: 4px 0 0;
    }

    .metric-card__footer {
      grid-column: 1 / 3;
      margin-top: 7px;
    }
  }

  .panel-heading {
    align-items: flex-start;
  }

  .trend-panel .panel-heading {
    flex-direction: column;
  }

  .trend-summary {
    flex-wrap: wrap;
  }

  .priority-tag {
    display: none;
  }

  .quick-actions {
    grid-template-columns: 1fr;

    button,
    button:nth-child(2n),
    button:nth-last-child(-n + 2) {
      border-right: 0;
      border-bottom: 1px solid var(--global-border-color);
    }

    button:last-child {
      border-bottom: 0;
    }
  }
}
</style>
