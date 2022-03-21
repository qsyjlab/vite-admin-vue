<!--
 * @Description: table
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 21:55:46
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 22:15:58
 * @FilePath: \vite-admin-vue\src\views\system\components\Table.vue
-->
<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>
    <qs-table :columns="columns" :data="dataSource" size="large"></qs-table>
  </el-card>
</template>
<script setup lang="ts">
import { defineColumns } from '@/components/utils'

const columns = defineColumns([
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
])

const dataSource = [
  {
    date: new Date()
  }
]
</script>
<style scoped></style>
