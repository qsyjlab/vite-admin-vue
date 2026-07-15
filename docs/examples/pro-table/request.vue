<template>
  <div>
    <ProTable
      ref="tableRef"
      v-model:loading="loading"
      header-title="基本使用"
      checkable
      :columns="columns"
      :request="request"
      :params="params"
      :response-adapter="responseAdapter"
      :transform-params="transformParams"
    />

    <el-space>
      <el-button type="primary" @click="table.reload()"
        >重载列表（页数回退并重新请求数据）</el-button
      >
      <el-button type="primary" @click="table.refresh()">刷新列表（仅重新请求数据）</el-button>
    </el-space>
  </div>
</template>
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import {
  ProTable,
  useProTable,
  type ProTableColumns,
  type ProTableInstance,
  type ProTableRequestParams,
  type ProTableRequestResult
} from '@framebase/element-plus-pro-components'

interface UserRecord {
  date: string
  name: string
  address: string
}

interface UserQuery {
  keyword?: string
}

interface UserResponse {
  data: UserRecord[]
  total: number
}

const loading = ref(false)
const params = ref<UserQuery>({})
const tableRef = useTemplateRef<ProTableInstance<UserRecord>>('tableRef')
const table = useProTable(tableRef)

const columns: ProTableColumns<UserRecord> = [
  {
    title: 'Date',
    key: 'date',
    dataIndex: 'date'
  },
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: 'Address',
    key: 'address',
    dataIndex: 'address'
  }
]

function sleep(delay = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({})
    }, delay)
  })
}

const request = async (): Promise<UserResponse> => {
  await sleep()
  return Promise.resolve({
    data: [
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }
    ],
    total: 30
  })
}

const transformParams = (requestParams: ProTableRequestParams<UserQuery>) => {
  return requestParams
}

const responseAdapter = (data: UserResponse): ProTableRequestResult<UserRecord> => {
  return {
    data: data.data,
    total: data.total
  }
}
</script>
<style scoped></style>
