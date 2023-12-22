<template>
  <div
    ref="proTableWrapperRef"
    class="pro-table"
    :style="{
      height: autoFitHeight ? '100%' : ''
    }"
  >
    <!-- header -->
    <div v-if="!!options" ref="toolbarRef">
      <toolbar
        :header-title="headerTitle"
        :columns="tableColums"
        :options="{
          ...(options === true ? {} : options),
          headerTitle: !!$slots.headerTitle,
          toolbar: !!$slots.toolbar
        }"
      >
        <template #headerTitle>
          <slot name="headerTitle"></slot>
        </template>
        <template #toolbar>
          <slot name="toolbar"></slot>
        </template>
      </toolbar>
    </div>

    <div v-if="showAlert" ref="alertRef" class="pro-table-alert">
      <slot name="alert">
        <el-alert
          v-if="alwaysShowAlert || selectedKeys.length"
          type="info"
          show-icon
          :closable="false"
        >
          <template #title
            >当前已选择 {{ selectedKeys.length }} 项
            <el-button type="primary" link @click="clearSelectedKeys">取消全部</el-button></template
          >
        </el-alert>
      </slot>
    </div>

    <component :is="wrapper" :ref="setRef" class="pro-table__wrapper" :model="editableRowsModel">
      <!-- table -->
      <el-table
        ref="tableInstanceRef"
        v-loading="loading"
        v-bind="{
          ...$attrs,
          style: undefined
        }"
        :height="tableProps.height"
        :style="{}"
        :border="border"
        :row-key="rowKey"
        :table-layout="tableLayout"
        :size="tableProps.size"
        :data="dataSource"
        @selection-change="selectChangeHandler"
      >
        <el-table-column
          v-if="checkable"
          type="selection"
          width="40"
          :reserve-selection="reserveSelection"
        />

        <template v-for="(item, idx) in getColumns" :key="`${item.key}-${idx}`">
          <pro-table-column :column="item" :row-key="props.rowKey"> </pro-table-column>
        </template>
      </el-table>
    </component>

    <!-- pagination -->
    <div v-if="pagination" ref="paginationRef" class="pro-table__pagination">
      <el-pagination
        v-bind="paginationProps"
        :small="tableProps.size === 'small'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, getCurrentInstance } from 'vue'
import { proTableProps, proTableEmits } from './props'
import { createProtableInstanceContext, createTableStoreContext, useTableStore } from './store'
import ProTableColumn from './pro-table-column.vue'
import toolbar from './components/toolbar/toolbar.vue'
import { columnsSort, columnsFilter, getRowkey } from './utils'
import './style.scss'
import { ElForm, type TableInstance } from 'element-plus'
import type { ProTableSlotScope, ProTableProps } from './types'

type DefualtSlotFn = (scope: ProTableSlotScope) => void

defineOptions({
  name: 'ProTable'
})

const instance = getCurrentInstance()

instance && createProtableInstanceContext(instance)

defineSlots<{
  headerTitle: () => void
  toolbar: () => void
  alert: () => void

  [key: string]: DefualtSlotFn
}>()

const props = defineProps(proTableProps)
const emits = defineEmits(proTableEmits)

/**
 * 将 props 转为 响应式类型
 * 如果非响应式透传 函数 props 将不在是响应式
 */

const store = useTableStore(reactive(props) as ProTableProps, { emits })

const {
  toolbarRef,
  alertRef,
  paginationRef,
  proTableWrapperRef,
  tableInstanceRef,
  tableActionRef,
  paginationProps,
  loading,
  pageQuery,
  columnsMap,
  tableProps,
  tableColums,
  dataSource,
  selectedKeys,
  setSelectedKeys,
  clearSelectedKeys,
  editableCellUtils,
  setQueryPage,
  setQueryPageSize,
  editableRowsModel
} = store

createTableStoreContext(store)

emits('register', tableActionRef)

const getColumns = computed(() =>
  columnsFilter(tableColums.value, columnsMap.value).sort(columnsSort(columnsMap.value))
)

const wrapper = computed(() => {
  if (props.editable?.enableValidate) {
    return ElForm
  }

  return 'div'
})

function setRef(ref: any) {
  if (props.editable?.enableValidate) {
    editableCellUtils.setFormInstanceRef(ref)
  }
}

function handleCurrentChange(page: number) {
  clearEffect()
  setQueryPage(page)
  emitPageChange()
}

function handleSizeChange(size: number) {
  clearEffect()
  setQueryPageSize(size)
  emitPageChange()
}

function clearEffect() {
  editableCellUtils.clearEditRow()
}

function emitPageChange() {
  emits('page-change', pageQuery.page, pageQuery.pageSize)
}

const selectChangeHandler: TableInstance['onSelection-change'] = selection => {
  if (Array.isArray(selection)) {
    setSelectedKeys(
      selection
        .map(row => {
          const realRowKey = getRowkey(row, props.rowKey)
          if (!realRowKey) return false
          return realRowKey
        })
        .filter(Boolean)
    )
  }
}

defineExpose(tableActionRef)
</script>
