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
        :default-checked-keys="defaultCheckedKeys"
        style="margin-bottom: 20px"
        title="固定在左侧"
        fixed="left"
        :columns="columnsStore.leftColumns"
        @move="moveNode"
        @check="checkChange"
        @change="changeColumns"
      ></setting-tree>
      <setting-tree
        v-if="columnsStore.autoColumns.length"
        :default-checked-keys="defaultCheckedKeys"
        style="margin-bottom: 20px"
        title="不固定"
        fixed="auto"
        :columns="columnsStore.autoColumns"
        @move="moveNode"
        @check="checkChange"
        @change="changeColumns"
      ></setting-tree>
      <setting-tree
        v-if="columnsStore.rightColumns.length"
        :default-checked-keys="defaultCheckedKeys"
        style="margin-bottom: 20px"
        title="固定在右侧"
        fixed="right"
        :columns="columnsStore.rightColumns"
        @move="moveNode"
        @check="checkChange"
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
  change: (columnsMap: any, orderKeys: string[]) => columnsMap && orderKeys
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
  allColumnKeys: Set<string>
}>({
  leftColumns: [],
  autoColumns: [],
  rightColumns: [],
  allColumnKeys: new Set()
})

const treeMap = new Map<string, any>()

let sortKeyColumns: string[] = []

function setSortKeyColumns(keys: string[]) {
  sortKeyColumns = keys
  return
}

const columnsState = reactive<{ value: Record<string, any>; defaultValue: Record<string, any> }>({
  value: {},
  defaultValue: {}
})

const defaultCheckedKeys = computed(() => Array.from(columnsStore.allColumnKeys))

watch(
  () => props.columns,
  () => {
    props.columns.forEach((col, index) => {
      columnsState.defaultValue[col.key] = {
        order: index,
        show: columnsState.value?.[col.key]?.show === false ? false : true,
        fixed: col.fixed
      }
    })
    const arr = loopColumns([...props.columns])

    columnsStore.leftColumns = [...arr.filter(i => i?.fixed === 'left')]
    columnsStore.autoColumns = [...arr.filter(i => !i.fixed)]
    columnsStore.rightColumns = [...arr.filter(i => i?.fixed === 'right')]

    columnsState.value = { ...columnsState.defaultValue }
    setSortKeyColumns(props.columns.map(c => c.key))
  },
  {
    immediate: true
  }
)

const checkChange = (keys: string[] | number[], halfKeys: string[] | number[]) => {
  Object.keys(columnsState.value).forEach(key => {
    const item = columnsState.value[key]

    const shouldShowKeys = [...keys, ...halfKeys]

    if (shouldShowKeys.includes(key)) {
      item.show = true
    } else {
      item.show = false
    }

    columnsState.value[key] = item
  })
  changeColumns()
}

const moveNode = (from: any, to: any, node: any) => {
  const storeMap: any = {
    auto: columnsStore.autoColumns,
    left: columnsStore.leftColumns,
    right: columnsStore.rightColumns
  }

  const col = storeMap[from].splice(
    storeMap[from].findIndex((l: any) => l.key === node.data.key),
    1
  )

  if (to === 'left') {
    col[0].fixed = 'left'
  } else if (to === 'right') {
    col[0].fixed = 'right'
  } else {
    col[0].fixed = undefined
  }

  storeMap[to].push(...col)

  changeColumns()
}

function changeColumns() {
  const orderKeys: string[] = []
  ;[...columnsStore.leftColumns, ...columnsStore.autoColumns, ...columnsStore.rightColumns].forEach(
    (col, index) => {
      orderKeys.push(col.key)
      columnsState.value[col.key] = {
        order: index,
        show: columnsState.value[col.key].show === false ? false : true,
        fixed: col.fixed
      }
    }
  )

  console.log('columnsState.value', columnsState.value)

  emits('change', { ...columnsState.value }, orderKeys)
}

function loopColumns(cols: any[]) {
  return cols.map(item => {
    const _col: any = {
      title: item.title,
      key: item.key,
      fixed: item.fixed,
      _rowKey: item.key
    }

    // 如果没有 children
    if (!item.children && columnsState.value[item.key]?.show !== false) {
      columnsStore.allColumnKeys.add(_col.key)
    }

    if (item.children) {
      _col.children = loopColumns(item.children)

      if (!_col.children.every((c: any) => columnsStore.allColumnKeys.has(c.key))) {
        columnsStore.allColumnKeys.add(_col.key)
      }
    }

    treeMap.set(item.key, item)

    return _col
  })
}

const changeFixed = (type: string) => {}
</script>
