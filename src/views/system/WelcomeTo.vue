<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:09:49
 * @LastEditors: qsyj
 * @LastEditTime: 2022-08-02 17:51:30
 * @FilePath: \vite-admin-vue\src\views\system\WelcomeTo.vue
-->

<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>

    <el-button type="primary">asdas</el-button>

    <el-button type="danger">asdas</el-button>
    <el-button type="danger">asdas</el-button>
  </el-card>
</template>

<script setup lang="ts">
import { getTodos } from '@/api/todos'

getTodos({}).then(res => {
  console.log('res', res)
})
</script>
