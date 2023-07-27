<template>
  <el-card>
    <template #header>{{ $route.meta.title }}</template>

    <VStepsForm :steps="steps" @submit="submit" />
  </el-card>
</template>
<script setup lang="ts">
import { VStepsForm } from '@/components/pro-form'

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
const step2 = [
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

const steps = [
  {
    title: '创建实验',
    form: fields,
    beforeNext: (values, next) => {
      setTimeout(() => {
        next()
      }, 2000)
    }
  },
  {
    title: '设置参数',
    form: step2
  },
  {
    title: '发布实验',
    form: step2
  }
]

const submit = (values: Record<string, any>, allValues: Record<string, any>, done) => {
  console.log('values', values, allValues)

  setTimeout(() => {
    done()
  }, 200)
}
</script>
<style scoped></style>
