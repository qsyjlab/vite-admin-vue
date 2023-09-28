<template>
  <el-card>
    <template #header>{{ $route.meta.title }}</template>
    <ProForm inline :fields="fields" @submit="submit" @reset="reset"> </ProForm>

    <template v-if="true">
      表单
      <ProForm :fields="fields" @register="register"> </ProForm>
      <el-button @click="customSubmit">自定义提交按钮</el-button>
      <el-button @click="updateFormConfig">更新表单配置</el-button>
      <el-button @click="insertFormConfig">插入新的配置</el-button>
      <el-button @click="removeFormConfig">移除配置</el-button>
    </template>
  </el-card>
</template>

<script lang="ts">
export default {
  name: 'ProForm'
}
</script>

<script setup lang="ts">
import { ProForm } from '@/components/pro-form'
import { useProForm } from '@/hooks'

const { register, validate, updateSchemas, appendSchemaByField, removeSchemaByField } = useProForm()

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
      span: 4
    }
  },
  {
    label: 'zone',
    el: 'el-input',
    key: 'zone',

    col: {
      span: 4
    },
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
    key: 'time123',
    col: {
      span: 4
    }
  },
  {
    label: 'time',
    el: 'el-input',
    key: 'time23',
    col: {
      span: 4
    }
  },
  {
    label: 'time',
    el: 'el-input',
    key: 'time2323',
    col: {
      span: 8
    }
  },

  {
    label: 'time',
    el: 'el-input',
    key: 'time23232',
    col: {
      span: 8
    }
  }
]

const updateFormConfig = () => {
  updateSchemas({
    label: '更新地区',
    key: 'zone',
    el: 'el-select',
    attrs: {
      options: [
        {
          label: '测试地区1',
          value: 1
        }
      ]
    }
  })

  updateSchemas([
    {
      label: '更新地区2',
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
      label: '更新时间',
      key: 'time23',
      col: {
        span: 4
      }
    }
  ])
}

const removeFormConfig = () => {
  removeSchemaByField(['zone', 'name'])
}

const insertFormConfig = () => {
  appendSchemaByField(
    {
      label: '新增项',
      el: 'el-input',
      key: 'name1',
      col: {
        span: 4
      }
    },
    'name'
  )
}

const customSubmit = () => {
  validate(values => {
    console.log('values', values)
  })
}

const submit = (values: any) => {
  console.log('values', values)
}

const reset = (values: any) => {
  console.log('values', values)
}
</script>
