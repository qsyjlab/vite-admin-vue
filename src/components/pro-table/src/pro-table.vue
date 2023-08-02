<template>
  <div class="pro-table">
    <!-- header -->
    <div class="pro-table-header">
      <div class="pro-table-header__left">
        <slot name="title">
          <span class="pro-table-header__title" v-if="headerTitle">
            {{ headerTitle }}
          </span>
        </slot>
        <slot></slot>
      </div>
      <div class="pro-table-header__right">
        <el-space>
          <el-tooltip effect="dark" content="刷新" placement="top">
            <span style="cursor: pointer" @click="refresh"
              ><el-icon :size="18"> <RefreshRight /> </el-icon
            ></span>
          </el-tooltip>

          <SettingColumns :columns="tableColums" />
        </el-space>
      </div>
    </div>
    <!-- table -->
    <el-table
      ref="tableRef"
      :data="dataSource"
      v-bind="$attrs"
      v-loading="loading"
      :border="border"
      :row-key="rowKey"
      :table-layout="tableLayout"
    >
      <el-table-column v-if="checkable" type="selection" width="55" :reserve-selection="true" />

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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useProTable } from './pro-table'
import { proTableProps, proTableEmits, proTableHeaderProps } from './props'
import { RefreshRight } from '@element-plus/icons-vue'
import SettingColumns from './components/column-setting.vue'
import ProTableColumn from './pro-table-column.vue'
import { createTableStoreContext, store } from './store'
import { computed, watch } from 'vue'

import './style.scss'

const props = defineProps(Object.assign({}, proTableProps, proTableHeaderProps))
const emits = defineEmits(proTableEmits)

createTableStoreContext()

const { columnsMap } = store

const {
  tableRef,
  tableColums,
  dataSource,
  pageQuery,
  handleCurrentChange,
  handleSizeChange,
  total,
  loading,
  reload,
  refresh,
  tableMethods
} = useProTable({
  props,
  emits
})

const getColumns = computed(() => {
  return proColumnsFilter(tableColums.value).sort((a, b) => {
    const aOrder = columnsMap.value[a.key]?.order || 0
    const bOrder = columnsMap.value[b.key]?.order || 0

    return aOrder - bOrder
  })
})

watch(getColumns, () => {
  tableMethods.doLayout()
})

// TODO: 当列由二级转变为一级表头布局错乱
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
        // children:
        //   column.children && column.children?.length ? proColumnsFilter(column.children) : undefined
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

defineExpose({
  reload
})
</script>
