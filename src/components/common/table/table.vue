<template>
  <div>
    <div class="table-tools">
      <slot name="extra"></slot>
    </div>

    <ElTable
      ref="tableInstanceRef"
      v-loading="loading"
      :border="true"
      :data="tableData"
      style="margin-bottom: 20px"
      :row-key="rowId"
      :tooltip-effect="tooltipEffect"
      :tree-props="treeProps"
      v-bind="{ ...$attrs }"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
    >
      <!-- checkbox列 -->
      <ElTableColumn v-if="selectedKeys" type="selection"></ElTableColumn>

      <!-- 索引列 -->
      <ElTableColumn v-if="!configData.noIndex" type="index" v-bind="indexRowAttrs">
        <template #default="{ $index }">
          {{ (query.page_num - 1) * query.page_size + ($index + 1) }}
        </template>
      </ElTableColumn>

      <!--数据体 -->
      <template v-for="item in getColums" :key="item.key">
        <ElTableColumn :prop="item.key" :label="item.title" v-bind="{ ...item }">
          <template #default="{ row, column, $index }">
            <slot :name="item.key" v-bind="{ ...{ row, column, $index } }">{{
              row[item.key]
            }}</slot>
          </template>
        </ElTableColumn>
      </template>
    </ElTable>
    <!-- 分页 -->
    <div class="ui-table-pagination">
      <ElPagination
        v-if="paginationAttrs"
        v-model:current-page="currentPage"
        v-bind="paginationAttrs"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </ElPagination>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'QsTable'
}
</script>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import type { TableRactiveType, SelectKeysType } from './table'
import { buildProps, indexDefaultConfig, paginationDefaultConfig } from './table'
import { ElTable } from 'element-plus'

const props = defineProps(buildProps)

const emit = defineEmits(['select', 'update:isReload', 'update:selectedKeys'])

const state = reactive<TableRactiveType>({
  tableData: [],
  currentPage: 1,
  query: {
    page_num: 1,
    page_size: props.pagination?.pageSize || paginationDefaultConfig.pageSize
  },
  total: 0,
  loading: true,
  // 列表选中key
  selectionkeys: []
})
// 获取表格dom元素
const tableInstanceRef = ref<typeof ElTable>()

const { loading, tableData, query, currentPage, total } = toRefs(state)

onMounted(() => {
  initialize()
})

// 监听是否刷新表单
watch(
  () => props.isReload,
  newVal => {
    if (newVal) {
      getHttp()
      updateIsReload(false)
    }
  }
)

// 监听 selectkeys
watch(
  (): any => props.selectedKeys,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return
    state.selectionkeys = [...newVal]
  }
)

// 监听params参数改变
watch(
  () => props.params,
  (newVal, oldVal) => {
    // 判断参数是否相同
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      state.query.page_num = 1
      state.currentPage = 1
      state.query = { ...state.query, ...newVal }
      getHttp()
    }
  },
  {
    deep: true
  }
)

// 监听data 变化
watch(
  () => props.data,
  newVal => {
    state.tableData = [...newVal]
  }
)

// 获取 table 列
const getColums = computed(() => {
  if (props.configData.columns && Array.isArray(props.configData.columns)) {
    return [...props.configData.columns]
  }
  return [...props.columns]
})

// 索引列属性
const indexRowAttrs = computed(() => {
  if (
    props.configData.index &&
    Object.prototype.toString.call(props.configData.index) === '[object Object]'
  ) {
    return {
      ...indexDefaultConfig,
      ...props.configData.index
    }
  }

  return { ...indexDefaultConfig }
})

// pagination attrs
const paginationAttrs = computed(() => {
  if (props.configData.pagination) {
    return {
      ...props.configData.pagination,
      layout: props.configData.pagination.layout?.join(','),
      total: state.total,
      pageSize: state.query.page_size
    }
  }
  return {
    ...paginationDefaultConfig,
    layout: paginationDefaultConfig.layout?.join(',')
  }
})

// 初始化
const initialize = async () => {
  if (!props.http) {
    state.tableData = props.data
    state.total = state.tableData.length
    state.loading = false
  } else if (props.http) {
    state.query = { ...state.query, ...props.params }
    getHttp()
  }
  updateIsReload(false)
}

// 处理分页事件
const handleSizeChange = (val: number): void => {
  state.query.page_size = val
  tableInstanceRef?.value?.clearSelection()
  state.query.page_num = 1

  if (!props.http) {
    state.total = state.tableData.length
  } else {
    getHttp()
  }
}

// 处理 页数改变
const handleCurrentChange = (val: number): void => {
  state.currentPage = val
  state.query.page_num = val

  tableInstanceRef.value?.clearSelection()

  if (!props.http) {
    state.total = state.tableData.length
  } else {
    getHttp()
  }
}

// 获取请求的数据
const getHttp = async () => {
  state.loading = true

  if (!props?.http) return console.warn('The required HTTP functions are missing')
  const res = await props?.http(state.query)

  try {
    state.tableData = props.handler(res.data.result)
    state.total = res.data.meta.total
    updateIsReload(false)
  } catch (error) {
    state.loading = false
  }
  state.loading = false
}

// 处理选中 select
const handleSelect = (selection: any, row: any) => {
  const ids = getKeys(selection, props?.treeProps?.children, [])

  const id = row[props.rowId]
  const obj = {
    selection,
    row,
    id,
    ids,
    type: 'single'
  }
  emit('select', obj)
}

// 选择全部事件
const handleSelectAll = (selection: any) => {
  const ids = getKeys(selection, props?.treeProps?.children, [])
  // let ids = selection.map((i) => i[props.rowId]);
  const obj = {
    selection,
    ids,
    type: 'all'
  }
  // tableInstanceRef.value.toggleRowSelection(selection.map(item=>item[props?.treeProps?.children]))
  updateSelectedKey(ids)
  emit('select', obj)
}

// 递归获取所有key

const handleSelectionChange = (selection: any) => {
  // let ids = selection.map((i) => i[props.rowId]);
  const ids = getKeys(selection, props?.treeProps?.children, [])
  state.selectionkeys = [...ids]
  updateSelectedKey(ids)
}

// 根据指定的子元素 递归获取所有key
const getKeys = (data = [], children = 'children', ids = []) => {
  data.forEach(item => {
    ids.push(item[props.rowId])
    if (Array.isArray(item[children])) return getKeys(item[children], children, ids)
  })
  return [...ids]
}

// 更新key
const updateSelectedKey = (ids: SelectKeysType) => {
  emit('update:selectedKeys', ids)
}

const updateIsReload = (val: boolean) => {
  emit('update:isReload', val)
}
</script>

<style scoped>
.ui-table-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* .el-loading-spinner >>> .circular {
  animation: none;
} */
.table-tools {
  margin-bottom: 20px;
  text-align: right;
}
</style>
