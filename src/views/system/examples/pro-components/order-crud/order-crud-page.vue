<template>
  <page-wrapper class="order-crud-page">
    <page-card full>
      <template #header>
        <div class="order-crud-page__header">
          <div class="order-crud-page__title">
            <div class="order-crud-page__title-icon"><Tickets /></div>
            <div>
              <h1>订单管理</h1>
              <p>覆盖查询、跨页选择、创建、异步编辑、详情与可编辑明细的完整 CRUD 流程</p>
            </div>
          </div>
          <div class="order-crud-page__capabilities">
            <el-tag effect="plain">服务端分页</el-tag>
            <el-tag effect="plain" type="success">字段错误回填</el-tag>
            <el-tag effect="plain" type="warning">草稿提交保护</el-tag>
          </div>
        </div>
      </template>

      <pro-form
        class="order-crud-page__search"
        :model="searchModel"
        :fields="searchSchema"
        inline
        default-collapsed
        :loading="tableLoading"
        :collapsed-rows="{ xs: 2, sm: 1, md: 1 }"
        :submitter="{ col: { span: 8, xs: 24, sm: 12, md: 8 } }"
        label-position="left"
        :label-width="84"
        :on-finish="handleSearch"
        @reset="handleResetSearch"
      />

      <div class="order-crud-page__table">
        <pro-table
          ref="tableRef"
          v-model:selected-keys="selectedKeys"
          :columns="tableColumns"
          :request="getOrderPage"
          :params="activeQuery"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }"
          :options="{ reload: true, density: true, setting: true }"
          :columns-state="{ persistenceKey: 'order-crud-table-columns' }"
          auto-fit-height
          checkable
          reserve-selection
          row-key="id"
          header-title="订单列表"
          @update:loading="tableLoading = $event"
          @request-error="handleRequestError"
        >
          <template #toolbar>
            <el-button
              type="danger"
              plain
              :icon="Delete"
              :disabled="selectedKeys.length === 0"
              @click="removeSelectedOrders"
            >
              批量删除
            </el-button>
            <el-button type="primary" :icon="Plus" :loading="metaLoading" @click="openCreate">
              新建订单
            </el-button>
          </template>

          <template #operation="{ row }">
            <el-space :size="4">
              <el-button link type="primary" @click="openDetail(row)">查看</el-button>
              <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
              <el-popconfirm
                :title="`确定删除订单 ${row.orderNo}？`"
                width="220"
                @confirm="removeOrder(row)"
              >
                <template #reference>
                  <el-button link type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </el-space>
          </template>
        </pro-table>
      </div>
    </page-card>

    <pro-modal-form
      ref="createFormRef"
      :fields="formSchema"
      :initial-values="createOrderFormModel()"
      :on-finish="createOrder"
      :before-submit="beforeCreateSubmit"
      :map-error="mapOrderError"
      :dialog-props="{ closeOnPressEscape: true }"
      title="新建订单"
      width="min(1040px, 94vw)"
      label-position="left"
      :label-width="96"
      @success="handleCreateSuccess"
    >
      <template #items-field="{ field, model }">
        <ProForm.FormItem
          :prop="field.name || 'items'"
          :label="field.label"
          :rules="field.rules"
          :required="field.required"
          fill
        >
          <order-items-editor
            ref="createItemsRef"
            v-model="model.items"
            :columns="itemColumnSchema"
            :meta="orderMeta"
          />
        </ProForm.FormItem>
      </template>
    </pro-modal-form>

    <pro-drawer-form
      ref="editFormRef"
      :fields="formSchema"
      :initial-values="createOrderFormModel()"
      :load="loadOrderForm"
      :on-finish="saveOrder"
      :before-submit="beforeEditSubmit"
      :map-error="mapOrderError"
      :drawer-props="{ closeOnPressEscape: true }"
      title="编辑订单"
      drawer-size="min(1080px, 96vw)"
      label-position="left"
      :label-width="96"
      @success="handleEditSuccess"
    >
      <template #items-field="{ field, model }">
        <ProForm.FormItem
          :prop="field.name || 'items'"
          :label="field.label"
          :rules="field.rules"
          :required="field.required"
          fill
        >
          <order-items-editor
            ref="editItemsRef"
            v-model="model.items"
            :columns="itemColumnSchema"
            :meta="orderMeta"
          />
        </ProForm.FormItem>
      </template>
    </pro-drawer-form>

    <order-detail-drawer
      ref="detailDrawerRef"
      :columns="descriptionColumns"
      :item-columns="itemColumnSchema"
      :group-titles="orderDescriptionGroupTitles"
    />
  </page-wrapper>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import { Delete, Plus, Tickets } from '@element-plus/icons-vue'
import { ElButton, ElMessage, ElMessageBox, ElPopconfirm, ElSpace, ElTag } from 'element-plus'
import {
  batchDeleteOrders,
  createOrder,
  deleteOrder,
  getOrderDetail,
  getOrderMeta,
  getOrderPage,
  updateOrder
} from '@/api/order'
import type {
  OrderDetail,
  OrderFieldError,
  OrderFormModel,
  OrderMeta,
  OrderQuery,
  OrderRecord
} from '@/api/order-types'
import { PageCard, PageWrapper } from '@/components'
import {
  ProDrawerForm,
  ProForm,
  ProModalForm,
  ProTable,
  useProDrawerForm,
  useProModalForm,
  useProTable,
  type FormFieldError,
  type FormMethodsType,
  type ProDrawerFormInstance,
  type ProModalFormInstance,
  type ProTableInstance
} from '@framebase/element-plus-pro-components'
import OrderDetailDrawer from './order-detail-drawer.vue'
import OrderItemsEditor from './order-items-editor.vue'
import {
  createOrderFormModel,
  descriptionColumns,
  formFields,
  itemColumns,
  normalizeOrderSearch,
  orderDescriptionGroupTitles,
  searchFields,
  tableColumns,
  type OrderSearchModel
} from './order-schema'

defineOptions({ name: 'OrderCrudPage' })

const emptyMeta: OrderMeta = { customers: [], owners: [], products: [] }
const orderMeta = ref<OrderMeta>(emptyMeta)
const metaLoading = ref(false)
let metaRequest: Promise<boolean> | undefined
const tableLoading = ref(false)
const searchModel = ref<OrderSearchModel>({})
const activeQuery = ref<OrderQuery>({})
const selectedKeys = ref<Array<string | number>>([])
const searchSchema = computed(() => searchFields(orderMeta.value))
const formSchema = computed(() => formFields(orderMeta.value))
const itemColumnSchema = computed(() => itemColumns(orderMeta.value))

const tableRef = useTemplateRef<ProTableInstance<OrderRecord>>('tableRef')
const table = useProTable(tableRef)
const createFormRef =
  useTemplateRef<ProModalFormInstance<OrderFormModel, OrderDetail>>('createFormRef')
const createForm = useProModalForm(createFormRef)
const editFormRef =
  useTemplateRef<ProDrawerFormInstance<OrderFormModel, OrderDetail>>('editFormRef')
const editForm = useProDrawerForm(editFormRef)
const createItemsRef = useTemplateRef<ComponentExposed<typeof OrderItemsEditor>>('createItemsRef')
const editItemsRef = useTemplateRef<ComponentExposed<typeof OrderItemsEditor>>('editItemsRef')
const detailDrawerRef =
  useTemplateRef<ComponentExposed<typeof OrderDetailDrawer>>('detailDrawerRef')

onMounted(() => {
  void loadMeta()
})

async function loadMeta() {
  if (orderMeta.value.products.length) return true
  if (metaRequest) return metaRequest

  metaLoading.value = true
  metaRequest = getOrderMeta()
    .then(meta => {
      orderMeta.value = meta
      return true
    })
    .catch(() => {
      ElMessage.error('订单基础数据加载失败，请稍后重试')
      return false
    })
    .finally(() => {
      metaLoading.value = false
      metaRequest = undefined
    })
  return metaRequest
}

function handleSearch(values: OrderSearchModel) {
  searchModel.value = { ...values }
  activeQuery.value = normalizeOrderSearch(values)
}

function handleResetSearch(values: OrderSearchModel) {
  handleSearch(values)
}

function handleRequestError() {
  ElMessage.error('订单列表加载失败')
}

async function openCreate() {
  if (!(await loadMeta())) return
  await createForm.open({ title: '新建订单', values: createOrderFormModel() })
}

async function openEdit(row: OrderRecord) {
  if (!(await loadMeta())) return
  await editForm.open({ id: row.id, title: `编辑订单 ${row.orderNo}` })
}

async function openDetail(row: OrderRecord) {
  await detailDrawerRef.value?.open(row.id)
}

async function loadOrderForm(id: string | number) {
  return createOrderFormModel(await getOrderDetail(String(id)))
}

async function saveOrder(values: OrderFormModel) {
  if (!values.id) throw new Error('缺少待编辑订单标识')
  return updateOrder(values.id, values)
}

async function beforeCreateSubmit(form: FormMethodsType<OrderFormModel>) {
  return saveItemDrafts(createItemsRef.value, form)
}

async function beforeEditSubmit(form: FormMethodsType<OrderFormModel>) {
  return saveItemDrafts(editItemsRef.value, form)
}

async function saveItemDrafts(
  editor: ComponentExposed<typeof OrderItemsEditor> | null,
  form: FormMethodsType<OrderFormModel>
) {
  if (!editor) return false
  const saved = await editor.saveAllEditable()
  if (!saved) {
    ElMessage.warning('请先修正订单明细中的错误')
    return false
  }
  form.setFieldValue('items', await editor.getData())
  return true
}

function mapOrderError(error: unknown): FormFieldError<OrderFormModel>[] {
  const payload = isRecord(error) && isRecord(error.data) ? error.data : error
  if (!isRecord(payload) || !Array.isArray(payload.fieldErrors)) return []
  return payload.fieldErrors.filter(isOrderFieldError)
}

function isOrderFieldError(value: unknown): value is OrderFieldError {
  return isRecord(value) && typeof value.name === 'string' && typeof value.errors === 'string'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

async function handleCreateSuccess(result?: OrderDetail) {
  ElMessage.success(result ? `订单 ${result.orderNo} 创建成功` : '订单创建成功')
  await table.clearSelection()
  await table.reload(true)
}

async function handleEditSuccess(result?: OrderDetail) {
  ElMessage.success(result ? `订单 ${result.orderNo} 更新成功` : '订单更新成功')
  await table.clearSelection()
  await table.reload(false)
  if (result && detailDrawerRef.value?.getData()?.id === result.id) {
    await detailDrawerRef.value.reload()
  }
}

async function removeOrder(row: OrderRecord) {
  await deleteOrder(row.id)
  ElMessage.success(`订单 ${row.orderNo} 已删除`)
  await table.clearSelection()
  await table.reload(false)
}

async function removeSelectedOrders() {
  if (!selectedKeys.value.length) return
  try {
    await ElMessageBox.confirm(
      `确定删除已选择的 ${selectedKeys.value.length} 条订单？该操作不可撤销。`,
      '批量删除订单',
      { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' }
    )
  } catch {
    return
  }
  const ids = selectedKeys.value.map(String)
  const result = await batchDeleteOrders(ids)
  ElMessage.success(`已删除 ${result.deleted} 条订单`)
  await table.clearSelection()
  await table.reload(true)
}
</script>

<style scoped lang="scss">
.order-crud-page {
  color: var(--el-text-color-primary);

  &__header {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  &__title {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 12px;

    h1 {
      margin: 0;
      color: var(--el-text-color-primary);
      font-size: 18px;
      line-height: 1.4;
    }

    p {
      margin: 3px 0 0;
      color: var(--el-text-color-secondary);
      font-size: var(--el-font-size-small);
      font-weight: 400;
    }
  }

  &__title-icon {
    display: inline-flex;
    width: 40px;
    height: 40px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: var(--el-border-radius-base);
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__capabilities {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  &__table {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex: 1 1 auto;
    flex-direction: column;
    padding: 0 16px 16px;

    :deep(.pro-table) {
      min-height: 0;
      flex: 1 1 auto;
    }
  }

  :deep(.page-card__body) {
    display: flex;
    min-height: 0;
    flex-direction: column;
  }

  &__search {
    flex: none;
  }
}

@media (max-width: 900px) {
  .order-crud-page {
    &__header {
      align-items: flex-start;
      flex-direction: column;
    }

    &__capabilities {
      justify-content: flex-start;
    }
  }
}

@media (max-width: 640px) {
  .order-crud-page {
    &__title {
      align-items: flex-start;
    }

    &__title-icon {
      width: 36px;
      height: 36px;
    }

    &__capabilities {
      display: none;
    }

    &__table {
      padding: 0 12px 12px;
    }
  }
}
</style>
