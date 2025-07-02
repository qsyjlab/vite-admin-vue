<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>
    <qs-table :columns="columns" :data="dataSource" size="large"></qs-table>
  </el-card>
</template>

<script lang="ts">
export default { name: 'TablePage' }
</script>

<script setup lang="ts">
// import { defineColumns } from '@/components/utils'

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
    title: 'address',
    key: 'address'
  }
]

const dataSource = [
  {
    date: new Date()
  }
]
</script>
<style scoped></style>
