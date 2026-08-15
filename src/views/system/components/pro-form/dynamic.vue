<template>
  <page-wrapper :full="false" class="form-dependency-demo">
    <header class="form-dependency-demo__header">
      <div>
        <h1>字段联动</h1>
        <p>依赖字段变化时，仅更新声明 dependencies 的相关配置</p>
      </div>
      <div class="form-dependency-demo__actions">
        <el-button @click="form.resetFields()">重置</el-button>
        <el-button type="primary" @click="submit">校验表单</el-button>
      </div>
    </header>

    <div class="form-dependency-demo__content">
      <section class="form-panel">
        <pro-form
          ref="formRef"
          :model="initialModel"
          :fields="fields"
          :label-width="104"
          enable-effect
          @effect="value => (snapshot = value as OrderForm)"
        />
      </section>

      <aside class="dependency-panel">
        <h2>当前联动状态</h2>
        <dl>
          <div>
            <dt>客户类型</dt>
            <dd>{{ snapshot.customer.type === 'company' ? '企业客户' : '个人客户' }}</dd>
          </div>
          <div>
            <dt>企业字段</dt>
            <dd>{{ snapshot.customer.type === 'company' ? '显示' : '隐藏' }}</dd>
          </div>
          <div>
            <dt>发票信息</dt>
            <dd>{{ snapshot.invoice.required ? '必填' : '隐藏' }}</dd>
          </div>
          <div>
            <dt>折扣上限</dt>
            <dd>{{ discountLimit }}%</dd>
          </div>
          <div>
            <dt>付款方式</dt>
            <dd>{{ snapshot.payment.type === 'credit' ? '账期' : '现结' }}</dd>
          </div>
          <div>
            <dt>审批级别</dt>
            <dd>{{ approvalLevel }}</dd>
          </div>
        </dl>
        <div class="dependency-panel__paths">
          <span>依赖路径</span>
          <code>customer.type</code>
          <code>invoice.required</code>
          <code>amount</code>
          <code>payment.type</code>
        </div>
      </aside>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { PageWrapper } from '@/components'
import {
  ProForm,
  useProForm,
  type FormMethodsType,
  type FormSchema
} from '@framebase/element-plus-pro-components'

defineOptions({ name: 'ProFormDependencyPage' })

interface OrderForm {
  customer: {
    type: 'individual' | 'company'
    companyName: string
  }
  invoice: {
    required: boolean
    title: string
    taxNumber: string
  }
  amount: number
  discount: number
  payment: {
    type: 'cash' | 'credit'
    term?: number
  }
  approvalNote: string
}

const initialModel: OrderForm = {
  customer: { type: 'individual', companyName: '' },
  invoice: { required: false, title: '', taxNumber: '' },
  amount: 50000,
  discount: 5,
  payment: { type: 'cash', term: undefined },
  approvalNote: ''
}

const snapshot = ref<OrderForm>(structuredClone(initialModel))
const customerOptions = [
  { label: '个人客户', value: 'individual' },
  { label: '企业客户', value: 'company' }
]
const paymentOptions = [
  { label: '现结', value: 'cash' },
  { label: '账期', value: 'credit' }
]

const fields: FormSchema<OrderForm>[] = [
  {
    key: 'customer-type',
    name: 'customer.type',
    label: '客户类型',
    valueType: 'radio',
    options: customerOptions,
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'company-name',
    name: 'customer.companyName',
    label: '企业名称',
    valueType: 'text',
    dependencies: ['customer.type'],
    show: ({ dependencies }) => dependencies['customer.type'] === 'company',
    rules: ({ dependencies }) =>
      dependencies['customer.type'] === 'company'
        ? [{ required: true, message: '请输入企业名称' }]
        : [],
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'invoice-required',
    name: 'invoice.required',
    label: '需要发票',
    valueType: 'switch',
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'invoice-title',
    name: 'invoice.title',
    label: '发票抬头',
    valueType: 'text',
    dependencies: ['invoice.required'],
    show: ({ dependencies }) => dependencies['invoice.required'] === true,
    rules: ({ dependencies }) =>
      dependencies['invoice.required'] ? [{ required: true, message: '请输入发票抬头' }] : [],
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'tax-number',
    name: 'invoice.taxNumber',
    label: '企业税号',
    valueType: 'text',
    dependencies: ['customer.type', 'invoice.required'],
    show: ({ dependencies }) =>
      dependencies['customer.type'] === 'company' && dependencies['invoice.required'] === true,
    rules: ({ dependencies }) =>
      dependencies['customer.type'] === 'company' && dependencies['invoice.required']
        ? [{ required: true, message: '请输入企业税号' }]
        : [],
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'amount',
    name: 'amount',
    label: '订单金额',
    valueType: { type: 'money', currency: 'CNY' },
    fieldProps: { min: 0, step: 10000 },
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'discount',
    name: 'discount',
    label: '折扣比例',
    valueType: 'percent',
    dependencies: ['customer.type', 'amount'],
    fieldProps: ({ dependencies }) => ({
      min: 0,
      max: dependencies['customer.type'] === 'company' ? 30 : 10,
      placeholder: `当前最高 ${dependencies['customer.type'] === 'company' ? 30 : 10}%`
    }),
    rules: ({ dependencies }) => [
      {
        type: 'number' as const,
        max: dependencies['customer.type'] === 'company' ? 30 : 10,
        message: '折扣超过当前客户类型上限'
      }
    ],
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'payment-type',
    name: 'payment.type',
    label: '付款方式',
    valueType: 'select',
    options: paymentOptions,
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'payment-term',
    name: 'payment.term',
    label: '账期天数',
    valueType: 'number',
    dependencies: ['payment.type'],
    disabled: ({ dependencies }) => dependencies['payment.type'] !== 'credit',
    fieldProps: ({ dependencies }) => ({
      min: 1,
      max: dependencies['payment.type'] === 'credit' ? 180 : 1,
      placeholder: dependencies['payment.type'] === 'credit' ? '1 - 180 天' : '选择账期后可用'
    }),
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'approval-note',
    name: 'approvalNote',
    label: '审批说明',
    valueType: 'textarea',
    shouldUpdate: (previous, current) =>
      getApprovalLevel(previous.amount) !== getApprovalLevel(current.amount),
    fieldProps: ({ values }) => ({
      rows: 3,
      placeholder: values.amount >= 100000 ? '大额订单，请补充审批依据' : '可填写订单补充说明'
    }),
    col: { span: 24 }
  }
]

const formRef = useTemplateRef<FormMethodsType<OrderForm>>('formRef')
const form = useProForm(formRef)
const discountLimit = computed(() => (snapshot.value.customer.type === 'company' ? 30 : 10))
const approvalLevel = computed(() => getApprovalLevel(snapshot.value.amount))

function getApprovalLevel(amount: number) {
  if (amount >= 500000) return '高级审批'
  if (amount >= 100000) return '部门审批'
  return '常规审批'
}

async function submit() {
  await form.validate()
}
</script>

<style scoped lang="scss">
.form-dependency-demo {
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
      line-height: 1.4;
      font-weight: 600;
    }

    p {
      margin: 3px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
  }

  &__content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 16px;
    align-items: start;
  }
}

.form-panel,
.dependency-panel {
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background: var(--el-bg-color);
}

.dependency-panel {
  h2 {
    margin: 0 0 16px;
    font-size: 16px;
  }

  dl {
    margin: 0;

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }
  }

  dt {
    color: var(--el-text-color-secondary);
  }

  dd {
    margin: 0;
    font-weight: 500;
  }

  &__paths {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 18px;

    span {
      width: 100%;
      margin-bottom: 2px;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }

    code {
      padding: 3px 6px;
      border-radius: 3px;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-regular);
      font-size: 12px;
    }
  }
}

@media (max-width: 900px) {
  .form-dependency-demo__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .form-dependency-demo__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
