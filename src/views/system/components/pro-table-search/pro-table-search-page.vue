<template>
  <page-wrapper>
    <page-card :header="$route.meta.title" full>
      <div class="table-search-demo">
        <pro-form
          class="table-search-demo__form"
          :model="searchModel"
          :fields="searchFields"
          inline
          default-collapsed
          :collapsed-rows="{ xs: 2, sm: 1 }"
          :submitter="{ col: { span: 6, xs: 24, sm: 8, md: 6 } }"
          label-position="left"
          :label-width="80"
          :on-finish="handleSearch"
          @reset="handleReset"
        />
        <div class="table-search-demo__table">
          <pro-table
            :columns="columns"
            :request="queryOrders"
            :params="activeQuery"
            row-key="id"
            header-title="订单查询结果"
            :index-border="false"
            :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }"
          />
        </div>
      </div>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PageCard, PageWrapper } from '@/components'
import {
  ProForm,
  ProTable,
  type ProFormSchema,
  type ProTableColumns,
  type ProTableRequestParams,
  type ProTableRequestResult
} from '@framebase/element-plus-pro-components'

defineOptions({
  name: 'ProTableSearchPage'
})

interface OrderRecord {
  id: number
  orderNo: string
  customer: { name: string }
  owner: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: string
}

interface OrderQuery {
  orderNo?: string
  customer?: { name?: string }
  owner?: string
  status?: OrderRecord['status']
  createdRange?: string[]
  createdFrom?: string
  createdTo?: string
}

const statusValueEnum = {
  pending: { text: '待处理', type: 'warning' },
  processing: { text: '进行中', type: 'primary' },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已取消', type: 'info' }
} as const
const ownerValueEnum = { 张伟: '张伟', 李娜: '李娜', 王强: '王强', 陈晨: '陈晨' }

const columns: ProTableColumns<OrderRecord> = [
  {
    key: 'order-number',
    dataIndex: 'orderNo',
    title: '订单编号',
    width: 150,
    fixed: 'left'
  },
  {
    key: 'customer-name',
    dataIndex: 'customer.name',
    title: '客户名称',
    minWidth: 160
  },
  {
    key: 'owner',
    dataIndex: 'owner',
    title: '负责人',
    width: 110
  },
  {
    key: 'amount',
    dataIndex: 'amount',
    title: '订单金额',
    width: 140,
    align: 'right',
    valueType: { type: 'money', currency: 'CNY' }
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: '状态',
    width: 110,
    valueType: 'status',
    valueEnum: statusValueEnum
  },
  {
    key: 'created-at',
    dataIndex: 'createdAt',
    title: '创建时间',
    width: 180,
    valueType: 'datetime'
  }
]

const searchFields: ProFormSchema<OrderQuery> = [
  {
    key: 'order-number-search',
    name: 'orderNo',
    label: '订单编号',
    valueType: 'text',
    col: { span: 6, xs: 24, sm: 12, md: 6 },
    fieldProps: { clearable: true, placeholder: '输入订单编号' }
  },
  {
    key: 'customer-name-search',
    name: 'customer.name',
    label: '客户名称',
    valueType: 'text',
    col: { span: 6, xs: 24, sm: 12, md: 6 },
    fieldProps: { clearable: true, placeholder: '输入客户名称' }
  },
  {
    key: 'owner-search',
    name: 'owner',
    label: '负责人',
    valueType: 'select',
    valueEnum: ownerValueEnum,
    col: { span: 6, xs: 24, sm: 12, md: 6 },
    fieldProps: { clearable: true, placeholder: '全部负责人' }
  },
  {
    key: 'status-search',
    name: 'status',
    label: '状态',
    valueType: 'select',
    valueEnum: statusValueEnum,
    col: { span: 6, xs: 24, sm: 12, md: 6 },
    fieldProps: { clearable: true, placeholder: '全部状态' }
  },
  {
    key: 'created-range-search',
    name: 'createdRange',
    label: '创建日期',
    valueType: 'date',
    fieldProps: {
      type: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    },
    col: { span: 12, xs: 24, sm: 24, md: 12 }
  }
]

const searchModel = ref<OrderQuery>({ status: 'processing' })
const activeQuery = ref<Partial<OrderQuery>>({ status: 'processing' })

function normalizeQuery(values: OrderQuery): Partial<OrderQuery> {
  const { createdRange, ...params } = values
  return {
    ...params,
    createdFrom: createdRange?.[0],
    createdTo: createdRange?.[1]
  }
}

function handleSearch(values: OrderQuery) {
  searchModel.value = { ...values }
  activeQuery.value = normalizeQuery(values)
}

function handleReset(values: OrderQuery) {
  handleSearch(values)
}

const owners = Object.keys(ownerValueEnum)
const customers = ['示例科技', '远航制造', '云图网络', '新域零售', '华辰数据']
const statuses: OrderRecord['status'][] = ['pending', 'processing', 'completed', 'cancelled']
const orderData: OrderRecord[] = Array.from({ length: 88 }, (_, index) => ({
  id: index + 1,
  orderNo: `SO-2026-${String(index + 1).padStart(4, '0')}`,
  customer: { name: customers[index % customers.length] },
  owner: owners[index % owners.length],
  amount: 12800 + index * 1375,
  status: statuses[index % statuses.length],
  createdAt: `2026-07-${String((index % 10) + 1).padStart(2, '0')} 10:30:00`
}))

async function queryOrders(
  params: ProTableRequestParams<OrderQuery>
): Promise<ProTableRequestResult<OrderRecord>> {
  await new Promise(resolve => setTimeout(resolve, 180))
  const filtered = orderData.filter(item => {
    if (params.orderNo && !item.orderNo.includes(params.orderNo)) return false
    if (params.customer?.name && !item.customer.name.includes(params.customer.name)) return false
    if (params.owner && item.owner !== params.owner) return false
    if (params.status && item.status !== params.status) return false
    const date = item.createdAt.slice(0, 10)
    if (params.createdFrom && date < params.createdFrom) return false
    if (params.createdTo && date > params.createdTo) return false
    return true
  })
  const start = (params.current - 1) * params.pageSize
  return {
    data: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
    success: true
  }
}
</script>

<style scoped>
.table-search-demo {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;

  &__form {
    padding: 16px 16px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
    background: var(--el-fill-color-extra-light);
  }

  &__table {
    min-height: 0;
    flex: 1 1 auto;
  }
}

:deep(.page-card__body) {
  display: flex;
  min-height: 0;
  flex-direction: column;
}
</style>
