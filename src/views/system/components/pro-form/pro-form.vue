<template>
  <el-card>
    <template #header>{{ $route.meta.title }}</template>
    <VProForm :fields="fields" @submit="submit" @reset="reset">
      <template #extra> 测试 </template>
    </VProForm>

    <VProForm
      :inline="false"
      :fields="fields"
      @submit="submit"
      @reset="reset"
      label-width="150px"
      label-position="top"
    >
      <template #extra> 测试 </template>
    </VProForm>
  </el-card>
</template>
<script setup lang="ts">
import { VProForm } from '@/components/pro-form'

const fields = [
  {
    label: 'name',
    el: 'el-input',
    key: 'name',
    rules: [
      { required: true, message: 'Please input Activity name', trigger: 'blur' },
      { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
    ]
  },
  {
    label: 'zone',
    el: 'el-input',
    key: 'zone'
  },
  {
    label: 'time',
    el: 'el-input',
    key: 'time'
  },
  {
    label: 'delivery',
    key: 'delivery',
    el: 'el-input'
  },
  // {
  //   label: 'time-picker-is-range',
  //   key: 'time-picker-is-range',
  //   el: 'el-time-picker',
  //   attrs: {
  //     'is-range': true,
  //     'arrow-control': true,
  //     'range-separator': 'To',
  //     'start-placeholder': 'Start time',
  //     'end-placeholder': 'End time'
  //   }
  // },
  {
    label: 'el-date-picker',
    key: 'el-date-picker',
    el: 'el-date-picker',
    attrs: {
      type: 'daterange',
      'is-range': true,
      'arrow-control': true,
      'range-separator': 'To',
      'start-placeholder': 'Start date',
      'end-placeholder': 'End date'
    }
  }
]

const submit = (values: any) => {
  console.log('values', values)
}

const reset = (values: any) => {
  console.log('values', values)
}
</script>
