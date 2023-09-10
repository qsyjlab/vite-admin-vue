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
      ref="tableRef"
      :key="new Date().getTime()"
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
        <pro-table-column :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <!-- {{ scope }} -->
            <slot :name="slot" v-bind="scope"></slot>
          </template>
        </pro-table-column>
      </template>
    </el-table>

    <!-- pagination -->
    <div class="pro-table__pagination" v-if="isPagination">
      <el-pagination
        v-model:current-page="pageQuery.pageNum"
        v-model:page-size="pageQuery.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :small="tableProps.size === 'small'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { useProTable } from './pro-table'
import { proTableProps, proTableEmits, proTableHeaderProps } from './props'
import ProTableColumn from './pro-table-column.vue'
import { createTableStoreContext, createTableAction, useTableStore } from './store'
import Toolbar from './components/toolbar/toolbar.vue'
import { columnsSort } from './utils'
import './style.scss'
import type { TableInstance } from 'element-plus'

defineSlots<{
  headerTitle: () => void
  toolbar: () => void
  alert: () => void
  [key: string]: (scope: { row: any }) => void
}>()

const props = defineProps(Object.assign({}, proTableProps, proTableHeaderProps))
const emits = defineEmits(proTableEmits)

const store = useTableStore({ columnsState: props.columnsState })
const {
  tableRef,
  tableColums,
  dataSource,
  pageQuery,
  handleCurrentChange,
  handleSizeChange,
  total,
  loading,
  tableMethods,
  setSelectedKeys,
  selectedKeys,
  clearSelectedKeys
} = useProTable({
  props,
  emits
})
const { columnsMap, tableProps } = store

createTableStoreContext(store)
createTableAction(tableMethods)

const getColumns = computed(() => {
  const newColumns = proColumnsFilter(tableColums.value).sort(columnsSort(columnsMap.value))

  return newColumns
})

watch(getColumns, () => {
  nextTick(() => {
    tableRef.value?.doLayout()
  })
})

const selectChangeHandler: TableInstance['onSelection-change'] = selection => {
  if (Array.isArray(selection)) {
    setSelectedKeys(selection.map(i => i[props.rowKey]).filter(Boolean))
  }
}

function proColumnsFilter(columns: any[]) {
  return columns
    .map(column => {
      const config = columnsMap.value[column.key] || {
        fixed: column.fixed
      }
      if (config && config.show === false) {
        return false
      }

      const tempColumn: any = {
        ...column,
        fixed: config.fixed,
        children: undefined
      }

      if (column.children && column.children?.length) {
        const children = proColumnsFilter(column.children)

        if (children.length) {
          tempColumn.children = children
        }
      }
      return tempColumn
    })
    .filter(Boolean)
}

defineExpose(tableMethods)
</script>
