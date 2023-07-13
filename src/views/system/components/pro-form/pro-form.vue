<template>
  <el-card>
    <template #header>{{ $route.meta.title }}</template>
    <VProForm grid :fields="fields" @submit="submit" @reset="reset">
      <template #extra> 测试 </template>
    </VProForm>

    <VProForm
      :grid="true"
      :inline="false"
      :fields="fields"
      @submit="submit"
      @reset="reset"
      label-width="150px"
    >
      <template #extra> 测试 </template>
    </VProForm>
  </el-card>
</template>

<script lang="ts">
export default {
  name: 'ProForm'
}
</script>

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
    ],
    col: {
      span: 8
    }
  },
  {
    label: 'zone',
    el: 'el-input',
    key: 'zone',
    col: {
      span: 8
    }

    // layoutCol: {
    //   span: 8
    // }
  },
  {
    label: 'time',
    el: 'el-input',
    key: 'time',
    col: {
      span: 8
    }
    // layoutCol: {
    //   span: 8
    // }
  },
  {
    label: 'delivery',
    key: 'delivery',
    el: 'el-input',
    col: {
      span: 8
    }
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
    col: {
      span: 8
    },
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
