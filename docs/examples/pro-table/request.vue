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
      :transform="transform"
      :transform-params="transformParams"
    />

    <el-space>
      <el-button type="primary" @click="tableRef.reload()"
        >重载列表（页数回退并重新请求数据）</el-button
      >
      <el-button type="primary" @click="tableRef.refresh()">刷新列表（仅重新请求数据）</el-button>
    </el-space>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const params = ref({})
const tableRef = ref()

const columns = [
  {
    title: 'Date',
    key: 'date'
  },
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Address',
    key: 'address'
  }
]

function sleep(delay = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({})
    }, delay)
  })
}

const request = async () => {
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

const transformParams = params => {
  console.log('transformParams', transformParams)

  return params
}

const transform = data => {
  console.log('data', data)

  return {
    data: data.data,
    total: data.total
  }
}
</script>
<style scoped></style>
