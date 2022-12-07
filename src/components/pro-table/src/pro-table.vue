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
        <el-tooltip effect="dark" content="刷新" placement="top">
          <span style="cursor: pointer" @click="refresh"
            ><el-icon :size="18"><RefreshRight /></el-icon
          ></span>
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <span style="cursor: pointer" @click="refresh"
            ><el-icon :size="18"><RefreshRight /></el-icon
          ></span>
        </el-tooltip>
      </div>
    </div>

    <!-- table -->
    <el-table
      :data="dataSource"
      v-bind="$attrs"
      :border="border"
      :row-key="rowKey"
      :table-layout="tableLayout"
    >
      <el-table-column v-if="checkable" type="selection" width="55" :reserve-selection="true" />
      <template v-for="(item, idx) in tableColums" :key="`${item.key}-${idx}`">
        <el-table-column :prop="item.key" :label="item.title" v-bind="{ ...item }">
          <template #default="{ row, column, $index }">
            <slot :name="item.key" v-bind="{ row, column, $index }">{{ row[item.key] }}</slot>
          </template>
          <template #header="{ column, $index }">
            <slot :name="`headerSlot${item.key}`" v-bind="{ column, $index }">{{
              column.label
            }}</slot>
          </template>
        </el-table-column>
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
import { useTable } from './pro-table'
import { proTableProps, proTableEmits, proTableHeaderProps } from './props'

import { RefreshRight } from '@element-plus/icons-vue'

import './style.scss'

const props = defineProps(Object.assign({}, proTableProps, proTableHeaderProps))
const emits = defineEmits(proTableEmits)

const {
  tableColums,
  dataSource,
  pageQuery,
  handleCurrentChange,
  handleSizeChange,
  total,
  reload,
  refresh
} = useTable({
  props,
  emits
})

defineExpose({
  reload
})
</script>
