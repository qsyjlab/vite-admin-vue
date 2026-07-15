<template>
  <page-wrapper>
    <page-card :header="$route.meta.title" full>
      <pro-table
        ref="tableRef"
        v-model:selected-keys="selectedKeys"
        class="pro-table-basic-demo"
        :columns="columns"
        :request="queryOrders"
        :params="requestParams"
        :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }"
        :url-state="{ key: 'orders' }"
        :columns-state="{ persistenceKey: 'pro-table-basic-columns' }"
        row-key="id"
        header-title="订单列表"
        checkable
        reserve-selection
        auto-fit-height
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <template #toolbar>
          <el-button type="primary" @click="reload">刷新数据</el-button>
          <el-button @click="clearSelection">清空选择</el-button>
        </template>

        <template #operation="{ row }">
          <el-button link type="primary" @click="ElMessage.info(`查看 ${row.orderNo}`)">
            查看
          </el-button>
        </template>
      </pro-table>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref, useTemplateRef } from 'vue'
import { PageCard, PageWrapper } from '@/components'
import {
  ProTable,
  useProTable,
  type ProTableColumns,
  type ProTableInstance,
  type ProTableRequestParams,
  type ProTableRequestResult,
  type ProTableSorter
} from '@framebase/element-plus-pro-components'

defineOptions({
  name: 'ProTablePage'
})

interface OrderRecord {
  id: number
  orderNo: string
  customer: { name: string }
  owner: string
  amount: number
  status: 'pending' | 'processing' | 'completed'
  progress: number
  createdAt: string
}

interface OrderQuery {
  businessType?: string
}

const statusValueEnum = {
  pending: { text: '待处理', type: 'warning' },
  processing: { text: '进行中', type: 'primary' },
  completed: { text: '已完成', type: 'success' }
} as const

const owners = ['张伟', '李娜', '王强', '陈晨']
const customers = ['示例科技', '远航制造', '云图网络', '新域零售']
const statuses: OrderRecord['status'][] = ['pending', 'processing', 'completed']
const orderData: OrderRecord[] = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  orderNo: `SO-2026-${String(index + 1).padStart(4, '0')}`,
  customer: { name: customers[index % customers.length] },
  owner: owners[index % owners.length],
  amount: 9600 + index * 1280,
  status: statuses[index % statuses.length],
  progress: 35 + ((index * 7) % 65),
  createdAt: `2026-07-${String((index % 10) + 1).padStart(2, '0')} 10:30:00`
}))

const requestParams = reactive<OrderQuery>({ businessType: 'sales' })
const selectedKeys = ref<Array<string | number>>([])
const tableRef = useTemplateRef<ProTableInstance<OrderRecord>>('tableRef')
const table = useProTable<OrderRecord>(tableRef)

const columns: ProTableColumns<OrderRecord> = [
  {
    key: 'order-number',
    dataIndex: 'orderNo',
    title: '订单编号',
    width: 150,
    fixed: 'left',
    tip: '稳定 key 与数据字段 dataIndex 相互独立'
  },
  {
    key: 'customer-name',
    dataIndex: ['customer', 'name'],
    title: '客户名称',
    minWidth: 160
  },
  { key: 'owner', dataIndex: 'owner', title: '负责人', width: 110 },
  {
    key: 'amount',
    dataIndex: 'amount',
    title: '订单金额',
    width: 140,
    align: 'right',
    valueType: { type: 'money', currency: 'CNY' },
    serverSort: 'amount'
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
    key: 'progress',
    dataIndex: 'progress',
    title: '进度',
    width: 160,
    valueType: 'progress'
  },
  {
    key: 'created-at',
    dataIndex: 'createdAt',
    title: '创建时间',
    width: 180,
    valueType: 'datetime'
  },
  { key: 'operation', title: '操作', width: 90, fixed: 'right' }
]

async function queryOrders(
  params: ProTableRequestParams<OrderQuery>
): Promise<ProTableRequestResult<OrderRecord>> {
  await new Promise(resolve => setTimeout(resolve, 160))
  const sortedData = params.sorter
    ? [...orderData].sort((left, right) => {
        const result = Number(left.amount) - Number(right.amount)
        return params.sorter?.order === 'descending' ? -result : result
      })
    : orderData
  const start = (params.current - 1) * params.pageSize
  return {
    data: sortedData.slice(start, start + params.pageSize),
    total: orderData.length,
    success: true
  }
}

function handleSortChange(sorter?: ProTableSorter) {
  ElMessage.info(sorter ? `服务端排序：${sorter.order}` : '已取消服务端排序')
}

async function reload() {
  await table.reload(false)
  ElMessage.success('数据已刷新')
}

async function clearSelection() {
  await table.clearSelection()
}

function handleSelectionChange(rows: OrderRecord[]) {
  if (rows.length) ElMessage.info(`已选择 ${rows.length} 条数据`)
}
</script>

<style scoped>
.pro-table-basic-demo {
  min-height: 0;
  flex: 1 1 auto;
}

:deep(.page-card__body) {
  display: flex;
  min-height: 0;
  flex-direction: column;
}
</style>
