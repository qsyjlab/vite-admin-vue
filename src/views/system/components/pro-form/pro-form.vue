<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <ProForm inline :fields="fields" @submit="submit" @reset="reset" @register="register">
      </ProForm>

      <template v-if="true">
        表单
        <ProForm :fields="fields"> </ProForm>
        <el-button @click="customSubmit">自定义提交按钮</el-button>
        <el-button @click="updateFormConfig">更新表单配置</el-button>
        <el-button @click="insertFormConfig">插入新的配置</el-button>
        <el-button @click="removeFormConfig">移除配置</el-button>
      </template>
    </page-card>
  </page-wrapper>
</template>

<script lang="ts">
export default {
  name: 'ProFormPage'
}
</script>

<script setup lang="ts">
import { PageCard, PageWrapper } from '@/components'
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
    label: 'ProSelect',
    el: 'ProSelect',
    key: 'ProSelect',
    attrs: {
      options: [
        {
          label: '测试数据1',
          value: '测试数据1'
        },
        {
          label: '测试数据2',
          value: '测试数据2'
        },
        {
          label: '禁用项',
          value: '2',
          disabled: true
        }
      ]
    },
    events: {
      change: (...rest: any[]) => {
        console.log('rest change', rest)
      }
    },
    col: {
      span: 14
    }
  },
  {
    label: 'ProSelect 多选',
    el: 'ProSelect',
    key: 'ProSelectMutiple',
    attrs: {
      multiple: true,
      'collapse-tags': true,
      filterable: true,
      options: [
        {
          label: '测试数据1',
          value: '测试数据1'
        },
        {
          label: '测试数据2',
          value: '测试数据2'
        },
        {
          label: '测试数据3',
          value: '测试数据3'
        },
        {
          label: '禁用项',
          value: '2',
          disabled: true
        }
      ]
    },
    col: {
      span: 14
    }
  },
  {
    label: 'ProSelect 分组模式',
    el: 'ProSelect',
    key: 'ProSelectGroup',
    attrs: {
      group: true,
      options: [
        {
          label: 'Popular cities',
          options: [
            {
              value: 'Shanghai',
              label: 'Shanghai'
            },
            {
              value: 'Beijing',
              label: 'Beijing'
            }
          ]
        },
        {
          label: 'City name',
          options: [
            {
              value: 'Chengdu',
              label: 'Chengdu'
            },
            {
              value: 'Shenzhen',
              label: 'Shenzhen'
            },
            {
              value: 'Guangzhou',
              label: 'Guangzhou'
            },
            {
              value: 'Dalian',
              label: 'Dalian'
            }
          ]
        }
      ]
    },
    col: {
      span: 7
    }
  },
  {
    label: 'ProSelect 远程搜索模式',
    el: 'ProSelect',
    key: 'ProSelectRemote',
    attrs: {
      filterable: true,
      remote: true,
      remoteMethod: () => {
        console.log('query')

        updateSchemas({
          key: 'ProSelectRemote',
          attrs: {
            options: Array(20)
              .fill(0)
              .map(() => {
                const key = Math.random() * 100
                return {
                  label: '测试数据-' + key,
                  value: '测试数据-' + key
                }
              })
          }
        })
      },
      options: [
        {
          value: 'Shanghai',
          label: 'Shanghai'
        },
        {
          value: 'Beijing',
          label: 'Beijing'
        }
      ]
    },
    col: {
      span: 6
    }
  },
  {
    label: 'ProCheckboxGruop',
    el: 'ProCheckboxGruop',
    key: 'ProCheckboxGruop',
    attrs: {
      options: [
        {
          value: 'Shanghai',
          label: 'Shanghai'
        },
        {
          value: 'Beijing',
          label: 'Beijing'
        }
      ]
    },
    col: {
      span: 20
    }
  },
  {
    label: 'ProCheckboxGruop 按钮模式',
    el: 'ProCheckboxGruop',
    key: 'ProCheckboxGruopButton',
    attrs: {
      tag: 'checkbox-button',
      options: [
        {
          value: 'Shanghai',
          label: 'Shanghai'
        },
        {
          value: 'Beijing',
          label: 'Beijing'
        }
      ]
    },
    col: {
      span: 20
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
