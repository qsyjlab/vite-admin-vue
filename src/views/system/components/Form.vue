<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-20 11:58:52
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 11:44:14
 * @FilePath: \vite-admin-vue\src\views\system\components\Form.vue
-->

<template>
  <el-card shadow="never">
    <template #header>
      {{ $route.meta.title }}
    </template>

    <el-card shadow="never">
      <template #header> form </template>

      <qs-form :form="form" @submit="submit"></qs-form>
    </el-card>
    <el-card shadow="never">
      <template #header> form inline</template>

      <qs-form :inline="true" :form="form"></qs-form>
    </el-card>
  </el-card>
</template>
<script setup lang="ts">
import { defineFormFields } from '@/components/utils'

const form = defineFormFields([
  {
    label: 'ElInput',
    key: 'input',
    tag: 'el-input'
  },
  {
    label: 'input',
    key: 'QsSelect',
    tag: 'qs-select',
    attrs: {
      options: [
        {
          label: '选项1',
          value: 1
        },
        {
          label: '选项2',
          value: 2
        }
      ]
    }
  },
  {
    label: 'QsCheckboxGroup',
    key: 'QsCheckboxGroup',
    tag: 'QsCheckboxGroup',
    attrs: {
      options: [
        {
          label: '选项1',
          value: 1
        },
        {
          label: '选项2',
          value: 2
        }
      ]
    }
  },
  {
    label: 'ElDatePicker',
    key: 'ElDatePicker',
    tag: 'ElDatePicker'
  }
])

const submit = (val: any) => {
  console.log('submit', val)
}
</script>
<style scoped></style>
