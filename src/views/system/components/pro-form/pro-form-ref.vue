<template>
  <page-wrapper>
    <page-card :full="false" header="ref 操作示例">
      <el-alert
        style="margin-bottom: 10px"
        title="推荐使用 useProForm 操作表单 ref,内置类型提示"
        type="warning"
      />
      <ProForm
        ref="formRef"
        v-model:dirty="dirty"
        v-model:loading="loading"
        default-collapsed
        :collapsed-rows="{ xs: 2, sm: 1 }"
        :fields="fields"
        :request="loadInitialValues"
        :label-width="100"
        label-position="left"
        :submitter="false"
      />
      <el-alert
        :title="loading ? '正在加载异步初始值' : dirty ? '表单有未保存修改' : '表单已同步'"
        :type="dirty ? 'warning' : 'success'"
        :closable="false"
        style="margin-bottom: 12px"
      />
      <div style="display: flex; justify-content: flex-end">
        <el-space>
          <el-button @click="setCollapsed(false)">展开</el-button>
          <el-button @click="setCollapsed(true)">收起</el-button>
          <el-button @click="toggleCollapse()">切换状态</el-button>
          <el-button @click="reset()">重置</el-button>
          <el-button @click="validate()">仅校验</el-button>
          <el-button @click="load()">重新加载</el-button>
          <el-button type="primary" @click="submit()">提交</el-button>
        </el-space>
      </div>
    </page-card>
  </page-wrapper>
</template>

<script lang="ts">
export default {
  name: 'ProFormRefPage'
}
</script>

<script setup lang="ts">
import { PageCard, PageWrapper } from '@/components'
import {
  type FormSchema,
  type ProFormInstance,
  useProForm,
  useProFormDirtyGuard
} from '@framebase/element-plus-pro-components'
import { ref, useTemplateRef } from 'vue'

const formRef = useTemplateRef<ProFormInstance>('formRef')
const { load, reset, setCollapsed, submit, toggleCollapse, validate } = useProForm(formRef)
const dirty = ref(false)
const loading = ref(false)
useProFormDirtyGuard(formRef)

async function loadInitialValues() {
  await new Promise(resolve => window.setTimeout(resolve, 260))
  return {
    input: 'demo',
    'input-number': 8,
    switch: true
  }
}

const baseFields: FormSchema[] = [
  {
    label: '文本输入',
    el: 'el-input',
    key: 'input',
    rules: [
      { required: true, message: 'Please input Activity name', trigger: 'blur' },
      { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
    ],
    col: {
      span: 8
    }
  },
  {
    label: '数字输入',
    el: 'el-input-number',
    key: 'input-number',
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
  }
]

const fields: FormSchema[] = baseFields.map(field => ({
  ...field,
  col: {
    span: 8,
    xs: 24,
    sm: 12,
    md: 8,
    ...field.col
  }
}))
</script>
