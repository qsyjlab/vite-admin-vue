<template>
  <el-tooltip effect="dark" content="刷新" placement="top">
    <span ref="triggerRef" style="cursor: pointer"
      ><el-icon :size="18"><Setting /></el-icon
    ></span>
  </el-tooltip>

  <!-- TODO: virtual-ref error -->
  <!-- <div>
    <el-popover
      ref="popoverRef"
      :virtual-ref="triggerRef"
      virtual-triggering
      placement="bottom"
      :width="300"
      trigger="click"
    >

    </el-popover>
  </div> -->
  <div>
    <div style="display: flex; align-items: center; justify-content: space-between">
      <span>
        <el-checkbox
          v-model="colSettingChecked.checked"
          label="列设置"
          size="large"
          :indeterminate="colSettingChecked.indeterminate"
        />
      </span>
      <span>
        <el-button link type="primary">重置</el-button>
      </span>
    </div>
    {{ defaultCheckedKeys }}

    <!-- <setting-tree
      v-if="columnsStore.leftColumns.length"
      :default-checked-keys="defaultCheckedKeys"
      style="margin-bottom: 20px"
      title="固定在左侧"
      fixed="left"
      :columns="columnsStore.leftColumns"
      @move="moveNode"
      @check="(keys, halfKeys) => checkChange('left', keys, halfKeys)"
      @change="changeColumns"
    ></setting-tree> -->
    <setting-tree
      v-if="columnsStore.autoColumns.length"
      :default-checked-keys="defaultCheckedKeys"
      style="margin-bottom: 20px"
      title="不固定"
      fixed="auto"
      :columns="columnsStore.autoColumns"
      @move="moveNode"
      @check="(keys, halfKeys) => checkChange('auto', keys, halfKeys)"
      @change="changeColumns"
    ></setting-tree>
    <!-- <setting-tree
      v-if="columnsStore.rightColumns.length"
      :default-checked-keys="defaultCheckedKeys"
      style="margin-bottom: 20px"
      title="固定在右侧"
      fixed="right"
      :columns="columnsStore.rightColumns"
      @move="moveNode"
      @check="(keys, halfKeys) => checkChange('right', keys, halfKeys)"
      @change="changeColumns"
    ></setting-tree> -->
  </div>
</template>

<script lang="ts" setup>
// import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
// import type { NodeDropType } from 'element-plus/es/components/tree/src/tree.type'
import { Setting } from '@element-plus/icons-vue'
import { computed, ref, watch, reactive } from 'vue'
import { useSettingStore } from './column-setting/store'

import SettingTree from './column-setting/setting-tree.vue'
import { provide } from 'vue'

const emits = defineEmits({
  change: (columnsMap: any, orderKeys: string[]) => columnsMap && orderKeys
})

const props = defineProps<{
  columns: any[]
}>()

const store = useSettingStore()

const { mergeColumnsMap, columnsMap } = store

provide('store', store)

const triggerRef = ref<HTMLDivElement>()
const popoverRef = ref()

const colSettingChecked = reactive({
  indeterminate: false,
  checked: false
})

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

const columnsState = reactive<{ value: Record<string, any>; defaultValue: Record<string, any> }>({
  value: {},
  defaultValue: {}
})

const treeMap = new Map<string, any>()

let sortKeyColumns: string[] = []

function setSortKeyColumns(keys: string[]) {
  sortKeyColumns = keys
}

const defaultCheckedKeys = computed(() => Array.from(columnsStore.allColumnKeys))

watch(
  () => props.columns,
  () => {
    const columnsMap: Record<string, any> = {}
    props.columns.forEach((col, index) => {
      columnsMap[col.key] = {
        order: index,
        show: columnsState.value[col.key]?.show === false ? false : true,
        fixed: col.fixed
      }
    })
    mergeColumnsMap(columnsMap)

    columnsState.value = columnsMap

    columnsStore.allColumnKeys.clear()
    const newColumns = loopColumns([...props.columns])
    let sortKeyColumns: string[] = []

    columnsStore.autoColumns = []
    columnsStore.leftColumns = []
    columnsStore.rightColumns = []

    newColumns.forEach(col => {
      sortKeyColumns.push(col.key)

      if (col.fixed === 'left') {
        columnsStore.leftColumns.push(col)
      } else if (col.fixed === 'right') {
        columnsStore.rightColumns.push(col)
      } else {
        columnsStore.autoColumns.push(col)
      }
    })

    setSortKeyColumns(sortKeyColumns)
  },
  {
    immediate: true
  }
)

const checkChange = (type: string, keys: string[] | number[], halfKeys: string[] | number[]) => {
  const cols: any = {
    auto: columnsStore.autoColumns,
    left: columnsStore.leftColumns,
    right: columnsStore.rightColumns
  }[type]

  const shouldShowKeys = [...keys, ...halfKeys]
  const columnKeyMap: any = {}
  const loopColumnsMap = (columns: any) => {
    columns.forEach((item: any) => {
      const columnKey = item.key
      if (columnKey) {
        columnKeyMap[columnKey] = {
          // 子节点 disable 时，不修改节点显示状态
          show: columnsState.value[columnKey]?.show === false ? false : item.show,
          fixed: item.fixed,
          order: columnsState.value[columnKey]?.order
        }
      }
      if (item.children) {
        loopColumnsMap(item.children)
      }
    })
  }

  loopColumnsMap(cols)

  columnsState.value = Object.assign(columnsState.value, columnKeyMap)

  cols.forEach((col: any) => {
    const state = columnsState.value[col.key]

    if (shouldShowKeys.includes(col.key)) {
      state.show = true
    } else {
      state.show = false
    }
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

      if (_col.children.every((c: any) => columnsStore.allColumnKeys.has(c.key))) {
        columnsStore.allColumnKeys.add(_col.key)
      }
    }

    return _col
  })
}

const changeFixed = (type: string) => {}
</script>
