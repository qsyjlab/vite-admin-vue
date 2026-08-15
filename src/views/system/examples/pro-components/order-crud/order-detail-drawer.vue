<template>
  <el-drawer
    v-model="visible"
    append-to-body
    destroy-on-close
    class="order-detail-drawer"
    size="min(920px, 96vw)"
  >
    <template #header>
      <div class="order-detail-drawer__heading">
        <span>订单详情</span>
        <small>{{ detail?.orderNo || '正在加载订单数据' }}</small>
      </div>
    </template>

    <pro-descriptions
      ref="descriptionsRef"
      v-model:data="detail"
      :columns="columns"
      :request="requestDetail"
      :params="{ id: currentId }"
      :auto-request="false"
      :group-titles="groupTitles"
      :column="{ xs: 1, sm: 2, md: 3 }"
      :collapsed-rows="{ xs: 3, sm: 2, md: 2 }"
      title="订单概览"
      collapsible
    >
      <template #extra>
        <el-button link type="primary" :icon="RefreshRight" @click="reload"> 刷新 </el-button>
      </template>
    </pro-descriptions>

    <section v-if="detail" class="order-detail-drawer__items">
      <pro-table
        :columns="itemColumns"
        :data="detail.items"
        :pagination="false"
        :options="false"
        :index-border="{ title: '序号', width: 60 }"
        header-title="订单明细"
        row-key="id"
      />
    </section>
  </el-drawer>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue'
import { ElButton, ElDrawer } from 'element-plus'
import { getOrderDetail } from '@/api/order'
import type { OrderDetail, OrderItem } from '@/api/order-types'
import {
  ProDescriptions,
  ProTable,
  type ProDescriptionColumns,
  type ProDescriptionsInstance,
  type ProTableColumns
} from '@framebase/element-plus-pro-components'

defineOptions({ name: 'OrderDetailDrawer' })

withDefaults(
  defineProps<{
    columns: ProDescriptionColumns<OrderDetail>
    itemColumns: ProTableColumns<OrderItem>
    groupTitles?: Record<string, string>
  }>(),
  {
    groupTitles: () => ({})
  }
)

const visible = ref(false)
const currentId = ref('')
const detail = ref<OrderDetail>()
const descriptionsRef =
  useTemplateRef<ProDescriptionsInstance<OrderDetail, { id: string }>>('descriptionsRef')

async function requestDetail(params: { id: string }) {
  if (!params.id) throw new Error('缺少订单标识')
  return getOrderDetail(params.id)
}

async function open(id: string) {
  currentId.value = id
  detail.value = undefined
  visible.value = true
  await nextTick()
  await reload()
}

async function reload() {
  return descriptionsRef.value?.reload({ id: currentId.value })
}

function close() {
  visible.value = false
}

defineExpose({
  open,
  close,
  reload,
  getVisible: () => visible.value,
  getData: () => detail.value
})
</script>

<style scoped lang="scss">
.order-detail-drawer {
  &__heading {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
    color: var(--el-text-color-primary);
    font-size: var(--el-font-size-large);
    font-weight: 600;

    small {
      overflow: hidden;
      color: var(--el-text-color-secondary);
      font-size: var(--el-font-size-small);
      font-weight: 400;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__items {
    margin-top: 20px;
    padding-top: 4px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

:global(.order-detail-drawer .el-drawer__body) {
  min-width: 0;
  overflow-x: hidden;
}

@media (max-width: 767px) {
  .order-detail-drawer__items {
    overflow-x: auto;
  }
}
</style>
