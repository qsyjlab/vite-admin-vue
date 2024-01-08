<template>
  <div>
    <ProTable
      v-model:selectedKeys="selectedKeys"
      header-title="基本使用"
      checkable
      :columns="columns"
      :data="tableData"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const selectedKeys = ref([])

const columns = [
  {
    title: 'Date',
    key: 'date',
    tip: '这是一个日期列'
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

const tableData = [
  {
    id: '1',
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: '2',
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: '3',
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: '4',
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
</script>
<style scoped></style>
