<template>
  <div class="order-items-editor">
    <pro-editable-table
      ref="editableTableRef"
      v-model="items"
      :columns="columns"
      :create-row="createRow"
      :on-save="normalizeRow"
      :on-delete="approveDelete"
      :options="{ density: true, setting: true }"
      :auto-fit-height="false"
      :show-alert="false"
      mode="multiple"
      row-key="id"
      @append-error="handleAppendError"
    />

    <div class="order-items-editor__summary">
      <span>共 {{ items.length }} 项商品</span>
      <strong>{{ formattedAmount }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import type { OrderItem, OrderMeta } from '@/api/order-types'
import {
  ProEditableTable,
  useProEditableTable,
  type ProEditableTableInstance,
  type ProTableColumns
} from '@framebase/element-plus-pro-components'
import { createOrderItem, normalizeOrderItem } from './order-schema'

defineOptions({ name: 'OrderItemsEditor' })

const props = defineProps<{
  columns: ProTableColumns<OrderItem>
  meta: OrderMeta
}>()

const items = defineModel<OrderItem[]>({ required: true })
const editableTableRef = useTemplateRef<ProEditableTableInstance<OrderItem>>('editableTableRef')
const editableTable = useProEditableTable(editableTableRef)

const totalAmount = computed(() =>
  items.value.reduce((total, item) => total + Number(item.lineAmount || 0), 0)
)
const formattedAmount = computed(() =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(totalAmount.value)
)

function createRow(): OrderItem {
  return createOrderItem()
}

function normalizeRow(row: OrderItem): OrderItem | false {
  const product = props.meta.products.find(option => option.value === row.productId)
  if (!product) {
    ElMessage.warning('请选择有效商品')
    return false
  }

  return normalizeOrderItem({
    ...row,
    productName: product.label,
    sku: product.sku,
    unitPrice: Number(row.unitPrice) > 0 ? Number(row.unitPrice) : product.unitPrice
  })
}

function approveDelete() {
  return true
}

function handleAppendError(error: { message: string }) {
  ElMessage.warning(error.message)
}

defineExpose({
  addRow: editableTable.addRow,
  getData: editableTable.getData,
  getEditableKeys: editableTable.getEditableKeys,
  validateEditable: editableTable.validateEditable,
  saveAllEditable: editableTable.saveAllEditable,
  cancelAllEditable: editableTable.cancelAllEditable
})
</script>

<style scoped lang="scss">
.order-items-editor {
  width: 100%;
  min-width: 0;

  &__summary {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 12px;
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-base);

    strong {
      min-width: 120px;
      color: var(--el-text-color-primary);
      font-size: var(--el-font-size-medium);
      text-align: right;
    }
  }
}
</style>
