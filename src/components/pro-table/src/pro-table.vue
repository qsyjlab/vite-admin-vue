<template>
  <div class="pro-table">
    <!-- header -->
    <toolbar :header-title="headerTitle" :columns="tableColums" :options="options">
      <template #headerTitle>
        <slot name="headerTitle"></slot>
      </template>
      <template #toolbar>
        <slot name="toolbar"></slot>
      </template>
    </toolbar>

    <slot name="alert">
      <div class="pro-table-alert">
        <el-alert v-if="selectedKeys.length" type="info" show-icon :closable="false">
          <template #title
            >当前已选择 {{ selectedKeys.length }} 项
            <el-button type="primary" link @click="clearSelectedKeys">取消全部</el-button></template
          >
        </el-alert>
      </div>
    </slot>
    <!-- table -->
    <el-table
      ref="tableInstanceRef"
      :data="dataSource"
      v-bind="$attrs"
      v-loading="loading"
      :border="border"
      :row-key="rowKey"
      :table-layout="tableLayout"
      :size="tableProps.size"
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

    <!-- pagination -->
    <div class="pro-table__pagination" v-if="pagination">
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Toolbar from './components/toolbar/toolbar.vue'
import { columnsSort, columnsFilter, getRowkey } from './utils'
import './style.scss'
import type { TableInstance } from 'element-plus'
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
const reactiveProps = reactive(props)

const store = useTableStore(reactiveProps as ProTableProps, { emits })

const {
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
  setQueryPageSize
} = store

createTableStoreContext(store)

emits('register', tableActionRef)

const getColumns = computed(() =>
  columnsFilter(tableColums.value, columnsMap.value).sort(columnsSort(columnsMap.value))
)

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
          return row[realRowKey]
        })
        .filter(Boolean)
    )
  }
}

defineExpose(tableActionRef)
</script>