<template>
  <page-wrapper>
    <page-card style="margin-bottom: 15px" :full="false" header="查询表单">
      <ProForm inline :fields="fields" :label-width="150" @submit="submit" @reset="reset">
      </ProForm>
    </page-card>
    <page-card style="margin-bottom: 15px" :full="false" header="查询表单（非grid模式）">
      <ProForm
        inline
        :layout="false"
        :fields="fields"
        :label-width="150"
        @submit="submit"
        @reset="reset"
      >
      </ProForm>
    </page-card>
    <page-card :full="false" header="基础表单">
      <ProForm inline :fields="fields" :label-width="150" @register="register"> </ProForm>
      <div style="display: flex; justify-content: flex-end">
        <el-space>
          <el-button @click="resetFields()">取消</el-button>
          <el-button type="primary" @click="validate()">提交</el-button>
        </el-space>
      </div>
    </page-card>
  </page-wrapper>
</template>

<script lang="ts">
export default {
  name: 'ProFormPage'
}
</script>

<script setup lang="ts">
import { PageCard, PageWrapper, type FormSchema, ProUploadList } from '@/components'
import { useProForm } from '@/hooks'

const { register, validate, resetFields } = useProForm()

const fields: FormSchema[] = [
  {
    label: '文本输入文本',
    el: 'el-input',
    key: 'input',
    tip: '输入文本在 3 到 5个之间',
    required: true,
    requiredMessage: '请输入必填项',
    rules: [{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }],
    col: {
      span: 8
    }
  },
  {
    label: '数字输入',
    el: 'el-input-number',
    key: 'input-number',
    fill: true,
    attrs: {},
    col: {
      span: 8
    }
  },
  {
    label: '额外渲染',
    el: 'el-input-number',
    key: 'input-number2',
    tip: '当数字输入大于5隐藏',
    fill: true,
    show: (_value, values) => {
      return values['input-number'] !== 5
    },
    attrs: {},
    col: {
      span: 8
    }
  },
  {
    label: '下拉选择器',
    el: 'pro-select',
    key: 'pro-select',
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
      span: 8
    }
  },
  {
    label: '下拉选择器 分组模式',
    el: 'ProSelect',
    key: 'select-group',
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
      span: 8
    }
  },
  {
    label: '下拉选择器 request',
    el: 'ProSelect',
    key: 'select-request',
    attrs: {
      group: true,
      filterable: true,
      remote: true,
      request: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([
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
            ])
          }, 2000)
        })
      }
    },
    col: {
      span: 8
    }
  },
  {
    label: '多选框组',
    el: 'ProCheckboxGroup',
    key: 'checkbox-group',
    attrs: {
      options: [
        {
          value: 1,
          label: '选项1'
        },
        {
          value: 2,
          label: '选项2'
        }
      ]
    },
    col: {
      span: 8
    }
  },
  {
    label: '多选框组按钮模式',
    el: 'ProCheckboxGroup',
    key: 'checkbox-group-button',
    attrs: {
      tag: 'checkbox-button',
      options: [
        {
          value: 1,
          label: '选项1'
        },
        {
          value: 2,
          label: '选项2'
        }
      ]
    },
    col: {
      span: 8
    }
  },
  {
    label: '单选框',
    el: 'ProRadioGroup',
    key: 'radio',
    attrs: {
      options: [
        {
          value: 1,
          label: '男'
        },
        {
          value: 2,
          label: '女'
        }
      ]
    },
    col: {
      span: 8
    }
  },
  {
    label: '评分',
    el: 'el-rate',
    key: 'rate',
    attrs: {},
    col: {
      span: 8
    }
  },
  {
    label: '滑块',
    el: 'el-slider',
    key: 'slider',
    attrs: {},
    col: {
      span: 8
    }
  },
  {
    label: '开关',
    el: 'el-switch',
    key: 'switch',
    attrs: {},
    col: {
      span: 8
    }
  },
  {
    label: '日期选择器',
    el: 'el-date-picker',
    key: 'date',
    attrs: {},
    col: {
      span: 8
    }
  },
  {
    label: '上传',
    el: 'ProUpload',
    key: 'upload',
    attrs: {},
    col: {
      span: 8
    }
  },
  {
    label: '上传列表',
    el: ProUploadList,
    key: 'upload-list',
    attrs: {},
    col: {
      span: 8
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
