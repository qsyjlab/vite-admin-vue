<template>
  <page-wrapper class="pro-form-page">
    <g-page-header
      title="基础表单"
      description="查询表单的 grid/非 grid 布局与基础表单、手动提交的完整用法。"
      :icon="Memo"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">查询表单</el-tag>
        <el-tag effect="plain" type="success">响应式栅格</el-tag>
      </template>
    </g-page-header>

    <pro-card title="查询表单">
      <ProForm
        inline
        default-collapsed
        :fields="responsiveFields"
        :label-width="100"
        label-position="left"
        :collapsed-rows="{ xs: 2, sm: 1 }"
        :submitter="{ col: { span: 6, xs: 24, sm: 8, md: 8, lg: 6 } }"
        @submit="submit"
        @reset="reset"
      />
    </pro-card>
    <pro-card title="查询表单（非grid模式）">
      <ProForm
        inline
        :layout="false"
        :fields="fields.slice(0, 4)"
        :label-width="100"
        label-position="left"
        @submit="submit"
        @reset="reset"
      >
      </ProForm>
    </pro-card>
    <pro-card title="基础表单">
      <ProForm
        ref="formRef"
        :fields="responsiveFields"
        :label-width="100"
        label-position="left"
        :submitter="false"
      />
      <div class="pro-form-page__actions">
        <el-space>
          <el-button @click="resetFields()">取消</el-button>
          <el-button type="primary" @click="validate()">提交</el-button>
        </el-space>
      </div>
    </pro-card>
  </page-wrapper>
</template>

<script lang="ts">
export default {
  name: 'ProFormPage'
}
</script>

<script setup lang="ts">
import { Memo } from '@element-plus/icons-vue'
import { GPageHeader, PageWrapper } from '@/components'
import {
  type FormMethodsType,
  type FormSchema,
  ProCard,
  ProUploadList,
  useProForm
} from '@framebase/element-plus-pro-components'
import { useTemplateRef } from 'vue'

const formRef = useTemplateRef<FormMethodsType>('formRef')
const { validate, resetFields } = useProForm(formRef)

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

const responsiveFields: FormSchema[] = fields.map(field => ({
  ...field,
  col: {
    span: 8,
    xs: 24,
    sm: 12,
    md: 8,
    ...field.col
  }
}))

const submit = (values: any) => {
  console.log('values', values)
}

const reset = (values: any) => {
  console.log('values', values)
}
</script>

<style scoped lang="scss">
.pro-form-page {
  gap: 16px;

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
