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
        <pro-table-column :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope"></slot>
          </template>
        </pro-table-column>
      </template>
    </el-table>

    <!-- pagination -->
    <div class="pro-table__pagination" v-if="pagination">
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
import { computed, onMounted, toRefs, reactive } from 'vue'
import { proTableProps, proTableEmits, proTableHeaderProps } from './props'
import { createTableStoreContext, useTableStore } from './store'
import ProTableColumn from './pro-table-column.vue'
import Toolbar from './components/toolbar/toolbar.vue'
import { columnsSort, columnsFilter } from './utils'
import './style.scss'
import type { TableInstance } from 'element-plus'
import type { EditableCellState } from './types'

type DefualtSlotFn = (scope: { row: any; editableState: EditableCellState }) => void

defineSlots<{
  headerTitle: () => void
  toolbar: () => void
  alert: () => void

  [key: string]: DefualtSlotFn
}>()

const props = defineProps(Object.assign({}, proTableProps, proTableHeaderProps))
const emits = defineEmits(proTableEmits)

/** 可能有优化空间 */
const proxyProps = reactive({
  ...toRefs(props),
  rowKey: props.rowKey,
  editableConfig: props.editable
})

const store = useTableStore(proxyProps, { emits })

const {
  tableInstanceRef,
  tableActionRef,
  total,
  loading,
  pageQuery,
  columnsMap,
  tableProps,
  tableColums,
  dataSource,
  handleCurrentChange,
  handleSizeChange,
  selectedKeys,
  setSelectedKeys,
  clearSelectedKeys
} = store

createTableStoreContext(store)

onMounted(() => {
  emits('register', tableActionRef)
})

const getColumns = computed(() => {
  const newColumns = columnsFilter(tableColums.value, columnsMap.value).sort(
    columnsSort(columnsMap.value)
  )

  return newColumns
})

const selectChangeHandler: TableInstance['onSelection-change'] = selection => {
  if (Array.isArray(selection)) {
    setSelectedKeys(selection.map(i => i[props.rowKey]).filter(Boolean))
  }
}

defineExpose(tableActionRef)
</script>
