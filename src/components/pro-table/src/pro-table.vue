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
              ><el-icon :size="18"><RefreshRight /></el-icon
            ></span>
          </el-tooltip>
        </el-space>
      </div>
    </div>

    <SettingColumns :columns="tableColums" @change="tableColumsSettingChange" />
    <!-- table -->
    <el-table
      :data="dataSource"
      v-bind="$attrs"
      v-loading="loading"
      :border="border"
      :row-key="rowKey"
      :table-layout="tableLayout"
    >
      <el-table-column v-if="checkable" type="selection" width="55" :reserve-selection="true" />
      <template v-for="(item, idx) in tableColums" :key="`${item.key}-${idx}`">
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
import { proTableProps, proTableEmits, proTableHeaderProps, ProTableColumnItem } from './props'
import { RefreshRight } from '@element-plus/icons-vue'
import SettingColumns from './components/column-setting.vue'
import './style.scss'

import ProTableColumn from './pro-table-column.vue'

const props = defineProps(Object.assign({}, proTableProps, proTableHeaderProps))
const emits = defineEmits(proTableEmits)

// const slots = useSlots()

const {
  tableColums,
  dataSource,
  pageQuery,
  handleCurrentChange,
  handleSizeChange,
  total,
  loading,
  reload,
  refresh
} = useProTable({
  props,
  emits
})

// TODO: 类型补全
const tableColumsSettingChange = (columnSettingMap: any, orderKeys: string[]) => {
  const columnsMap: Record<string, ProTableColumnItem> = {}

  const _newCols: any[] = []

  tableColums.value.forEach(col => {
    columnsMap[col.key] = col
  })

  // 暂时假定不会出现 空key值
  orderKeys.forEach(key => {
    const col = columnsMap[key]

    col.fixed = columnSettingMap[key].fixed
    _newCols.push(col)
  })

  tableColums.value = _newCols
}

defineExpose({
  reload
})
</script>
