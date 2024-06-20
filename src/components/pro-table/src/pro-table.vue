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

    <div
      v-if="showAlert && (alwaysShowAlert || selectedKeys.length)"
      ref="alertRef"
      class="pro-table__alert"
    >
      <slot name="alert">
        <el-alert type="info" show-icon :closable="false">
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
<script setup lang="ts" generic="T = any, Q = Record<string | number, any>">
import { computed, reactive, getCurrentInstance, toValue } from 'vue'
import { ElForm, type TableInstance } from 'element-plus'
import { proTableProps, proTableEmits } from './props'
import { createProtableInstanceContext, createTableStoreContext, useTableStore } from './store'
import ProTableColumn from './pro-table-column.vue'
import toolbar from './components/toolbar/toolbar.vue'
import { columnsSort, columnsFilter, getRowkey } from './utils'
import './style.scss'
import type { ProTableSlotScope, ProTableProps, ProTableColumns } from './types'
import { definePropType } from '@/utils'

defineOptions({
  name: 'ProTable'
})

const instance = getCurrentInstance()

instance && createProtableInstanceContext(instance)

defineSlots<{
  headerTitle: () => void
  toolbar: () => void
  alert: () => void

  [key: string]: (scope: ProTableSlotScope<T>) => void
}>()

const props = defineProps({
  ...proTableProps,
  /** 列配置 */
  columns: {
    type: definePropType<ProTableColumns<T>>(Array),
    default: () => []
  },
  /** 外部请求参数 */
  params: {
    type: definePropType<Q>(Object)
  },
  /** 数据 同 el-table data */
  data: {
    type: definePropType<T[]>(Array),
    default: () => []
  }
})
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
  cacheSelectedData,
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
  if (!props.reserveSelection) {
    clearSelectedKeys()
  }
  editableCellUtils.clearEditRow()
}

function emitPageChange() {
  emits('page-change', pageQuery.page, pageQuery.pageSize)
}

// 重写 onSelection-change 支持多页选择回显
const selectChangeHandler: TableInstance['onSelection-change'] = selection => {
  if (Array.isArray(selection)) {
    if (props.reserveSelection) {
      const dataKeys = dataSource.value.map(row => getRowkey(row, props.rowKey))

      const selectionKeys = selection.map(row => getRowkey(row, props.rowKey))

      dataKeys.forEach(rowKey => {
        if (!selectionKeys.includes(rowKey)) {
          if (cacheSelectedData.has(rowKey)) {
            cacheSelectedData.delete(rowKey)
          }
        }
      })

      selection.forEach(item => {
        const rowKey = getRowkey(item, props.rowKey)

        if (!cacheSelectedData.has(rowKey)) {
          cacheSelectedData.set(rowKey, item)
        }
      })

      setSelectedKeys(Array.from(cacheSelectedData.keys()))

      emits(
        'selection-change',
        toValue(() => Array.from(cacheSelectedData.values()))
      )
    } else {
      emits('selection-change', selection)
    }
  }
}

defineExpose(tableActionRef)
</script>
