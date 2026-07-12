<template>
  <ProForm
    ref="formRef"
    v-model:collapsed="collapsed"
    inline
    :fields="fields"
    :model="initialValues"
    :label-width="88"
    label-position="left"
    :collapsed-rows="{ xs: 2, sm: 1 }"
    :submitter="{ col: { span: 6, xs: 24, sm: 8, md: 8, lg: 6 } }"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import {
  type FormSchema,
  type ProFormInstance,
  ProForm,
  useProForm
} from '@vite-admin/pro-components'

interface QueryModel {
  keyword?: string
  status?: 'enabled' | 'disabled'
  owner?: string
  createdAt?: string
}

const collapsed = ref(true)
const initialValues: QueryModel = { status: 'enabled' }
const fields: FormSchema<QueryModel>[] = [
  {
    key: 'keyword',
    name: 'keyword',
    label: '关键词',
    valueType: 'text',
    col: { span: 8, xs: 24, sm: 12, md: 8 }
  },
  {
    key: 'status',
    name: 'status',
    label: '状态',
    valueType: 'select',
    valueEnum: { enabled: '启用', disabled: '停用' },
    col: { span: 8, xs: 24, sm: 12, md: 8 }
  },
  {
    key: 'owner',
    name: 'owner',
    label: '负责人',
    valueType: 'text',
    col: { span: 8, xs: 24, sm: 12, md: 8 }
  },
  {
    key: 'created-at',
    name: 'createdAt',
    label: '创建日期',
    valueType: 'date',
    col: { span: 8, xs: 24, sm: 12, md: 8 }
  }
]

const formRef = useTemplateRef<ProFormInstance<QueryModel>>('formRef')
useProForm(formRef)

function handleSubmit(values: QueryModel) {
  console.log(values)
}
</script>
