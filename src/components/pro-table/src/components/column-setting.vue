<template>
  <el-tooltip effect="dark" content="刷新" placement="top">
    <span ref="triggerRef" style="cursor: pointer"
      ><el-icon :size="18"><Setting /></el-icon
    ></span>
  </el-tooltip>

  <!-- TODO: virtual-ref error -->
  <div>
    <el-popover
      ref="popoverRef"
      :virtual-ref="triggerRef"
      virtual-triggering
      placement="bottom"
      :width="300"
      trigger="click"
    >
      <setting-tree
        v-if="columnsStore.leftColumns.length"
        style="margin-bottom: 20px"
        title="固定在左侧"
        fixed="left"
        :columns="columnsStore.leftColumns"
        @move="moveNode"
        @change="changeColumns"
      ></setting-tree>
      <setting-tree
        v-if="columnsStore.autoColumns.length"
        style="margin-bottom: 20px"
        title="不固定"
        fixed="auto"
        :columns="columnsStore.autoColumns"
        @move="moveNode"
        @change="changeColumns"
      ></setting-tree>
      <setting-tree
        v-if="columnsStore.rightColumns.length"
        style="margin-bottom: 20px"
        title="固定在右侧"
        fixed="right"
        :columns="columnsStore.rightColumns"
        @move="moveNode"
        @change="changeColumns"
      ></setting-tree>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
// import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
// import type { NodeDropType } from 'element-plus/es/components/tree/src/tree.type'
import { Setting } from '@element-plus/icons-vue'
import { computed, ref, watch, reactive } from 'vue'

import SettingTree from './column-setting/setting-tree.vue'

const emits = defineEmits({
  change: (columns: any) => columns
})

const props = defineProps<{
  columns: any[]
}>()

const triggerRef = ref<HTMLDivElement>()
const popoverRef = ref()
const columnsStore = reactive<{
  leftColumns: any[]
  autoColumns: any[]
  rightColumns: any[]
}>({
  leftColumns: [],
  autoColumns: [],
  rightColumns: []
})

let sortKeyColumns: string[] = []

function setSortKeyColumns(keys: string[]) {
  sortKeyColumns = keys
  return
}

const columnsState = reactive<{ value: Record<string, any>; defaultValue: Record<string, any> }>({
  value: {},
  defaultValue: {}
})

watch(
  () => props.columns,
  () => {
    const arr = buildColumns(props.columns)

    columnsStore.leftColumns = arr.filter(i => i?.fixed === 'left')
    columnsStore.autoColumns = arr.filter(i => !i.fixed)
    columnsStore.rightColumns = arr.filter(i => i?.fixed === 'right')

    props.columns.forEach((col, index) => {
      columnsState.defaultValue[col.key] = {
        order: index,
        show: true,
        fixed: col.fixed,
        disabled: false
      }
    })
    columnsState.value = { ...columnsState.defaultValue }

    setSortKeyColumns(props.columns.map(c => c.key))
  },
  {
    immediate: true
  }
)

const moveNode = (from: any, to: any, node: any) => {
  console.log('from ,to', from, to)

  const storeMap: any = {
    auto: columnsStore.autoColumns,
    left: columnsStore.leftColumns,
    right: columnsStore.rightColumns
  }

  const col = storeMap[from].splice(
    storeMap[from].findIndex((l: any) => l.key === node.data.key),
    1
  )
  storeMap[to].push(...col)

  // changeColumns()
}

function changeColumns() {
  emits('change', [
    ...columnsStore.leftColumns,
    ...columnsStore.autoColumns,
    ...columnsStore.rightColumns
  ])
}

function buildColumns(cols: any[]) {
  return cols.map((item, index) => {
    const _col: any = {
      title: item.title,
      key: item.key,
      fixed: item.fixed,
      _rowKey: item.key
    }

    if (Array.isArray(item.children) && item.children.length) {
      _col.children = buildColumns(item.children)
    }

    return _col
  })
}

const _columns = computed(() => {
  return buildColumns(props.columns || [])
})

const changeFixed = (type: string) => {}
</script>
