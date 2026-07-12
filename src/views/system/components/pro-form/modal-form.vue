<template>
  <page-wrapper :full="false" class="container-demo">
    <header class="container-demo__header">
      <div>
        <h1>Modal Form</h1>
        <p>异步校验、编辑数据加载、提交转换与服务端错误回填</p>
      </div>
      <div class="container-demo__actions">
        <el-button @click="modal.open({ title: '新建合同' })">新建</el-button>
        <el-button type="primary" @click="modal.open({ id: 1, title: '编辑合同' })">
          编辑示例
        </el-button>
      </div>
    </header>

    <section class="result-panel">
      <h2>最近提交</h2>
      <pre>{{ lastSubmit ? JSON.stringify(lastSubmit, null, 2) : '暂无提交记录' }}</pre>
    </section>

    <pro-modal-form
      ref="modalRef"
      :fields="fields"
      :initial-values="initialValues"
      :load="loadContract"
      :on-finish="saveContract"
      :map-error="mapServerError"
      :dialog-props="{ closeOnPressEscape: true }"
      label-position="left"
      :label-width="88"
      @success="(_, values) => (lastSubmit = values)"
    />
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { PageWrapper } from '@/components'
import {
  ProModalForm,
  useProModalForm,
  type FormFieldError,
  type FormSchema,
  type ProModalFormInstance
} from '@vite-admin/pro-components'

defineOptions({ name: 'ProModalFormPage' })

interface ContractForm {
  name: string
  customer: string
  amount: number | string
  startDate: string
  remark: string
}

const initialValues: ContractForm = {
  name: '',
  customer: '',
  amount: 0,
  startDate: '',
  remark: ''
}
const lastSubmit = ref<ContractForm>()

const fields: FormSchema<ContractForm>[] = [
  {
    key: 'contract-name',
    name: 'name',
    label: '合同名称',
    valueType: 'text',
    normalize: value => String(value || '').trimStart(),
    rules: [
      { required: true, message: '请输入合同名称' },
      {
        asyncValidator: async (_rule, value) => {
          await wait(250)
          if (value === '重复合同') throw new Error('合同名称已存在')
        },
        trigger: 'blur'
      }
    ],
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'customer',
    name: 'customer',
    label: '签约客户',
    valueType: 'text',
    required: true,
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'amount',
    name: 'amount',
    label: '合同金额',
    valueType: { type: 'money', currency: 'CNY' },
    fieldProps: { min: 0, step: 10000 },
    transform: value => Number(value || 0),
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'start-date',
    name: 'startDate',
    label: '生效日期',
    valueType: 'date',
    required: true,
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'remark',
    name: 'remark',
    label: '备注',
    valueType: 'textarea',
    fieldProps: { rows: 3 },
    col: { span: 24 }
  }
]

const modalRef = useTemplateRef<ProModalFormInstance<ContractForm, ContractForm>>('modalRef')
const modal = useProModalForm(modalRef)

async function loadContract() {
  await wait(300)
  return {
    name: '数据平台建设合同',
    customer: '示例科技有限公司',
    amount: 280000,
    startDate: '2026-07-01',
    remark: '编辑数据由 load 异步载入'
  }
}

async function saveContract(values: ContractForm) {
  await wait(500)
  if (values.customer === '错误客户') {
    throw { fieldErrors: [{ name: 'customer', errors: '该客户已被停用' }] }
  }
  return values
}

function mapServerError(error: unknown): FormFieldError<ContractForm>[] {
  if (error && typeof error === 'object' && 'fieldErrors' in error) {
    return (error as { fieldErrors: FormFieldError<ContractForm>[] }).fieldErrors
  }
  return []
}

function wait(duration: number) {
  return new Promise(resolve => window.setTimeout(resolve, duration))
}
</script>

<style scoped lang="scss">
.container-demo {
  color: var(--el-text-color-primary);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;

    h1 {
      margin: 0;
      font-size: 22px;
    }

    p {
      margin: 4px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
  }
}

.result-panel {
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background: var(--el-bg-color);

  h2 {
    margin: 0 0 12px;
    font-size: 16px;
  }

  pre {
    min-height: 100px;
    margin: 0;
    padding: 14px;
    overflow: auto;
    border-radius: 4px;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-regular);
  }
}

@media (max-width: 640px) {
  .container-demo__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
