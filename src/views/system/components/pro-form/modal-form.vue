<template>
  <el-card>
    <template #header>{{ $route.meta.title }}</template>

    <VModalForm title="modal 表单" :fields="fields" @submit="submit" />
  </el-card>
</template>
<script setup lang="ts">
import { VModalForm } from '@/components/pro-form'

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
    key: 'zone',
    attrs: {
      options: [
        {
          label: '测试地区1',
          value: 1
        }
      ]
    }
  },
  {
    label: 'time',
    el: 'el-input',
    key: 'time123'
  },
  {
    label: 'time',
    el: 'el-input',
    key: 'time23'
  },
  {
    label: 'time',
    el: 'el-input',
    key: 'time2323'
  },

  {
    label: 'time',
    el: 'el-input',
    key: 'time23232'
  }
]

const submit = (values: Record<string, any>, done: () => void) => {
  console.log('values', values)
  done()
}
</script>
<style scoped></style>
