<template>
  <page-wrapper :full="false" class="query-filter-page">
    <header class="component-page-header">
      <div>
        <h1>ProQueryFilter</h1>
        <p>独立查询面板，可与 ProTable、列表或任意业务请求显式组合。</p>
      </div>
      <div class="header-actions">
        <el-button @click="applyRiskPreset">高风险预设</el-button>
        <el-button type="primary" @click="submitFilter">执行查询</el-button>
      </div>
    </header>

    <pro-query-filter
      ref="queryFilterRef"
      v-model="queryModel"
      :fields="fields"
      :transform="transformQuery"
      :collapsed-rows="{ xs: 2, sm: 1 }"
      :submitter-col="{ span: 8, xs: 24, sm: 12, lg: 8 }"
      label-position="left"
      :label-width="76"
      @search="handleSearch"
    />

    <section class="summary-grid">
      <article>
        <span>匹配订单</span>
        <strong>{{ filteredOrders.length }}</strong>
      </article>
      <article>
        <span>订单金额</span>
        <strong>¥{{ totalAmount.toLocaleString() }}</strong>
      </article>
      <article>
        <span>风险订单</span>
        <strong>{{ riskCount }}</strong>
      </article>
    </section>

    <section class="result-panel">
      <pro-table
        :columns="columns"
        :data="filteredOrders"
        :pagination="false"
        header-title="查询结果"
        :options="false"
        row-key="id"
      />
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { ElButton } from 'element-plus'
import { PageWrapper } from '@/components'
import {
  ProQueryFilter,
  ProTable,
  useProQueryFilter,
  type ProQueryFilterInstance,
  type ProTableColumns,
  type ProTableSearchField
} from '@framebase/element-plus-pro-components'

defineOptions({ name: 'ProQueryFilterPage' })

type OrderStatus = 'pending' | 'processing' | 'completed'
type RiskLevel = 'normal' | 'attention' | 'high'

interface OrderQuery {
  keyword?: string
  owner?: string
  status?: OrderStatus
  risk?: RiskLevel
  createdRange?: string[]
}

interface OrderParams extends Omit<OrderQuery, 'createdRange'> {
  createdFrom?: string
  createdTo?: string
}

interface OrderRecord {
  id: number
  orderNo: string
  customer: string
  owner: string
  status: OrderStatus
  risk: RiskLevel
  amount: number
  createdAt: string
}

const queryModel = ref<OrderQuery>({})
const appliedParams = ref<OrderParams>({})
const queryFilterRef =
  useTemplateRef<ProQueryFilterInstance<OrderQuery, OrderParams>>('queryFilterRef')
const queryFilter = useProQueryFilter(queryFilterRef)

const fields: ProTableSearchField<OrderQuery>[] = [
  {
    key: 'keyword',
    name: 'keyword',
    label: '关键词',
    valueType: 'input',
    fieldProps: { placeholder: '订单号 / 客户名称', clearable: true },
    col: { span: 8, xs: 24, sm: 12, lg: 8 }
  },
  {
    key: 'owner',
    name: 'owner',
    label: '负责人',
    valueType: 'select',
    valueEnum: { 张伟: '张伟', 李娜: '李娜', 王强: '王强' },
    fieldProps: { placeholder: '全部负责人', clearable: true },
    col: { span: 8, xs: 24, sm: 12, lg: 8 }
  },
  {
    key: 'status',
    name: 'status',
    label: '状态',
    valueType: 'select',
    valueEnum: {
      pending: '待处理',
      processing: '进行中',
      completed: '已完成'
    },
    fieldProps: { placeholder: '全部状态', clearable: true },
    col: { span: 8, xs: 24, sm: 12, lg: 8 }
  },
  {
    key: 'risk',
    name: 'risk',
    label: '风险等级',
    valueType: 'select',
    valueEnum: { normal: '正常', attention: '关注', high: '高风险' },
    fieldProps: { placeholder: '全部等级', clearable: true },
    col: { span: 8, xs: 24, sm: 12, lg: 8 }
  },
  {
    key: 'createdRange',
    name: 'createdRange',
    label: '创建日期',
    valueType: 'date',
    fieldProps: {
      type: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    },
    col: { span: 16, xs: 24, sm: 24, lg: 16 }
  }
]

const columns: ProTableColumns<OrderRecord> = [
  { key: 'orderNo', title: '订单编号', dataIndex: 'orderNo', minWidth: 150 },
  { key: 'customer', title: '客户名称', dataIndex: 'customer', minWidth: 150 },
  { key: 'owner', title: '负责人', dataIndex: 'owner', width: 100 },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    width: 110,
    valueType: 'status',
    valueEnum: {
      pending: { text: '待处理', type: 'warning' },
      processing: { text: '进行中', type: 'primary' },
      completed: { text: '已完成', type: 'success' }
    }
  },
  {
    key: 'risk',
    title: '风险',
    dataIndex: 'risk',
    width: 100,
    valueType: 'status',
    valueEnum: {
      normal: { text: '正常', type: 'success' },
      attention: { text: '关注', type: 'warning' },
      high: { text: '高风险', type: 'danger' }
    }
  },
  {
    key: 'amount',
    title: '金额',
    dataIndex: 'amount',
    width: 130,
    align: 'right',
    valueType: { type: 'money', currency: 'CNY' }
  },
  { key: 'createdAt', title: '创建日期', dataIndex: 'createdAt', width: 120 }
]

const orderData: OrderRecord[] = [
  {
    id: 1,
    orderNo: 'SO-2026-0714',
    customer: '云图网络',
    owner: '张伟',
    status: 'processing',
    risk: 'high',
    amount: 186000,
    createdAt: '2026-07-14'
  },
  {
    id: 2,
    orderNo: 'SO-2026-0713',
    customer: '远航制造',
    owner: '李娜',
    status: 'pending',
    risk: 'attention',
    amount: 92000,
    createdAt: '2026-07-13'
  },
  {
    id: 3,
    orderNo: 'SO-2026-0712',
    customer: '华辰数据',
    owner: '王强',
    status: 'completed',
    risk: 'normal',
    amount: 268000,
    createdAt: '2026-07-12'
  },
  {
    id: 4,
    orderNo: 'SO-2026-0711',
    customer: '新域零售',
    owner: '张伟',
    status: 'processing',
    risk: 'attention',
    amount: 128000,
    createdAt: '2026-07-11'
  },
  {
    id: 5,
    orderNo: 'SO-2026-0710',
    customer: '示例科技',
    owner: '李娜',
    status: 'pending',
    risk: 'high',
    amount: 316000,
    createdAt: '2026-07-10'
  },
  {
    id: 6,
    orderNo: 'SO-2026-0709',
    customer: '云图网络',
    owner: '王强',
    status: 'completed',
    risk: 'normal',
    amount: 76000,
    createdAt: '2026-07-09'
  }
]

const filteredOrders = computed(() =>
  orderData.filter(order => {
    const params = appliedParams.value
    const keyword = params.keyword?.trim().toLowerCase()
    if (keyword && !`${order.orderNo} ${order.customer}`.toLowerCase().includes(keyword)) {
      return false
    }
    if (params.owner && order.owner !== params.owner) return false
    if (params.status && order.status !== params.status) return false
    if (params.risk && order.risk !== params.risk) return false
    if (params.createdFrom && order.createdAt < params.createdFrom) return false
    if (params.createdTo && order.createdAt > params.createdTo) return false
    return true
  })
)
const totalAmount = computed(() =>
  filteredOrders.value.reduce((total, order) => total + order.amount, 0)
)
const riskCount = computed(() => filteredOrders.value.filter(order => order.risk === 'high').length)

function transformQuery(values: OrderQuery): OrderParams {
  const { createdRange, ...params } = values
  return {
    ...params,
    createdFrom: createdRange?.[0],
    createdTo: createdRange?.[1]
  }
}

function handleSearch(params: OrderParams) {
  appliedParams.value = { ...params }
}

async function applyRiskPreset() {
  await queryFilter.setFieldsValue({ status: 'processing', risk: 'high' })
  await queryFilter.submit()
}

async function submitFilter() {
  await queryFilter.submit()
}
</script>

<style scoped lang="scss">
.query-filter-page {
  min-width: 0;
}

.component-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;

  h1 {
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 6px 0 0;
    color: var(--el-text-color-secondary);
  }
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 16px 0;

  article {
    display: grid;
    gap: 8px;
    padding: 18px;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--el-border-radius-base);
    background: var(--el-bg-color-overlay);
  }

  span {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  strong {
    font-size: 24px;
    line-height: 1.2;
  }
}

.result-panel {
  padding: 0 18px 18px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color-overlay);
}

@media (max-width: 760px) {
  .component-page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
