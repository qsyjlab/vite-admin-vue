<template>
  <page-wrapper>
    <page-card header="动态表单">
      <el-alert
        style="margin-bottom: 10px"
        title="推荐使用 useProForm 操作表单 ref,内置类型提示"
        type="warning"
      />
      <pro-form ref="formRef" :fields="fields" :label-width="150"> </pro-form>
    </page-card>
  </page-wrapper>
</template>

<script lang="ts">
export default {
  name: 'ProFormPage'
}
</script>

<script setup lang="ts">
import { FormSchema, PageCard, PageWrapper, ProFormInstance } from '@/components'
import { ref } from 'vue'

// const { register, validate, resetFields } = useProForm()

const formRef = ref<ProFormInstance>()

const fields: FormSchema[] = [
  {
    label: '禁用禁用项',
    el: 'el-switch',
    key: 'switch1',
    col: {
      span: 8
    }
  },
  {
    label: '禁用表单项',
    el: 'el-input-number',
    key: 'input-number',
    attrs: {},
    disabled: (value, values) => {
      return values.switch1
    },
    col: {
      span: 8
    }
  },
  {
    label: '隐藏隐藏项',
    el: 'el-switch',
    key: 'hideen',
    col: {
      span: 8
    }
  },
  {
    label: '隐藏项',
    el: 'el-switch',
    key: 'hideen2',
    show: (value, values) => {
      return !values.hideen
    },
    col: {
      span: 8
    }
  },
  {
    label: 'bool 直接显示',
    el: 'el-input',
    key: 'o1',
    show: true,
    col: {
      span: 8
    }
  },
  {
    label: 'disabled 或 attrs.disabled 直接禁用',
    el: 'el-input',
    key: 'o1',
    show: true,
    disabled: true
  }
]
</script>
