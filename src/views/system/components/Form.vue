<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-20 11:58:52
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-20 20:48:58
 * @FilePath: \vite-admin-vue\src\views\system\components\Form.vue
-->

<template>
  <el-card shadow="never">
    <template #header>
      {{ $route.meta.title }}
    </template>

    <el-card shadow="never">
      <template #header> form </template>
    </el-card>
  </el-card>
</template>
<script setup lang="ts">
import { defineFormFields } from '@/components/utils'

const form = defineFormFields([
  {
    label: 'test',
    key: 'test',
    tag: 'el-input'
  }
])

const submit = (val: any) => {
  console.log('submit', val)
}
</script>
<style scoped></style>
