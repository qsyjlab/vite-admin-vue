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
    <el-card shadow="never">
      <template #header> form inline</template>

      <qs-form :inline="true" :form="form"></qs-form>
    </el-card>

    <el-card shadow="never">
      <template #header> form inline</template>

      <qs-form :inline="true" :form="form"></qs-form>
    </el-card>
  </el-card>
</template>
<script lang="ts">
export default { name: 'Form' }
</script>

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
  // console.log('submit', val)
}
</script>
<style scoped></style>
