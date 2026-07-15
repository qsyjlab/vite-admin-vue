<template>
  <page-wrapper>
    <page-card :header="$route.meta.title" full>
      <pro-table-with-search
        class="table-search-demo"
        :columns="columns"
        :search-fields="searchFields"
        :request="queryOrders"
        :initial-values="{ status: 'processing' }"
        :search-props="searchProps"
        :table-props="tableProps"
      />
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { PageCard, PageWrapper } from '@/components'
import {
  ProTableWithSearch,
  splitProTableSearchColumns,
  type ProTableSearchColumn,
  type ProTableWithSearchProps
} from '@framebase/element-plus-pro-components'
import type {
  ProTableRequestParams,
  ProTableRequestResult
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

const columnDefinitions: ProTableSearchColumn<OrderRecord, OrderQuery>[] = [
  {
    key: 'order-number',
    dataIndex: 'orderNo',
    title: '订单编号',
    width: 150,
    fixed: 'left',
    search: true
  },
  {
    key: 'customer-name',
    dataIndex: 'customer.name',
    title: '客户名称',
    minWidth: 160,
    search: true
  },
  {
    key: 'owner',
    dataIndex: 'owner',
    title: '负责人',
    width: 110,
    search: { valueType: 'select', valueEnum: ownerValueEnum, order: 2 }
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
    valueEnum: statusValueEnum,
    search: { valueType: 'select', valueEnum: statusValueEnum, order: -1 }
  },
  {
    key: 'created-at',
    dataIndex: 'createdAt',
    title: '创建时间',
    width: 180,
    valueType: 'datetime',
    search: {
      key: 'search-created-range',
      name: 'createdRange',
      label: '创建日期',
      valueType: 'date',
      fieldProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      },
      col: { span: 12, xs: 24, sm: 24, md: 12 },
      order: 3
    }
  }
]

const { columns, searchFields } = splitProTableSearchColumns(columnDefinitions)
const searchProps: ProTableWithSearchProps<OrderRecord, OrderQuery>['searchProps'] = {
  collapsedRows: { xs: 2, sm: 1 },
  labelPosition: 'left',
  labelWidth: 80,
  transform: values => {
    const { createdRange, ...params } = values
    return {
      ...params,
      createdFrom: createdRange?.[0],
      createdTo: createdRange?.[1]
    }
  }
}
const tableProps: ProTableWithSearchProps<OrderRecord, OrderQuery>['tableProps'] = {
  rowKey: 'id',
  headerTitle: '订单查询结果',
  indexBorder: false,
  pagination: { pageSize: 10, pageSizes: [10, 20, 50] }
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
  min-height: 0;
  flex: 1 1 auto;
}

:deep(.page-card__body) {
  display: flex;
  min-height: 0;
  flex-direction: column;
}
</style>
