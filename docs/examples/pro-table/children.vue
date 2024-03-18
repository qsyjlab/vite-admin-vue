<template>
  <div>
    <ProTable
      v-model:selectedKeys="selectedKeys"
      header-title="多级表头"
      checkable
      :columns="columns"
      :data="tableData"
    >
      <template #name1>插槽</template>
    </ProTable>
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
    key: 'name',
    children: [
      {
        title: 'name1',
        key: 'name1'
      },
      {
        title: 'name-2',
        key: 'name-2'
      }
    ]
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
