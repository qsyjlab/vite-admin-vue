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
            <el-button link type="primary" @click="reset">重置</el-button>
          </span>
        </div>

        <setting-tree
          v-if="columnsStore.leftColumns.length"
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
          style="margin-bottom: 20px"
          title="固定在右侧"
          fixed="right"
          :columns="columnsStore.rightColumns"
          @move="moveNode"
          @check="checkChange"
          @change="changeColumns"
        ></setting-tree>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
// import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
// import type { NodeDropType } from 'element-plus/es/components/tree/src/tree.type'
import { Setting } from '@element-plus/icons-vue'
import { ref, watch, reactive, nextTick } from 'vue'
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

const { mergeColumnsMap, columnsMap, getColumnMapConfig, setDefaultColumnsMap, resetColumnsMap } =
  store

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
}>({
  leftColumns: [],
  autoColumns: [],
  rightColumns: []
})

const unInitWatch = watch(
  () => props.columns,
  () => {
    initColumnsMap()
    nextTick(() => {
      unInitWatch()
    })
  },
  {
    immediate: true
  }
)

watch(
  () => props.columns,
  () => {
    initColumnsStore()
  },
  {
    immediate: true
  }
)

function initColumnsMap() {
  const _columnsMap: Record<string, any> = {}
  props.columns.forEach((col, index) => {
    _columnsMap[col.key] = {
      order: index,
      show: _columnsMap[col.key]?.show === false ? false : true,
      fixed: col.fixed
    }
  })

  setDefaultColumnsMap(_columnsMap)
  mergeColumnsMap(_columnsMap)
}

function initColumnsStore() {
  const newColumns = loopColumns([...props.columns])

  columnsStore.autoColumns = []
  columnsStore.leftColumns = []
  columnsStore.rightColumns = []

  newColumns.forEach(col => {
    if (col.fixed === 'left') {
      columnsStore.leftColumns.push(col)
    } else if (col.fixed === 'right') {
      columnsStore.rightColumns.push(col)
    } else {
      columnsStore.autoColumns.push(col)
    }
  })
}

const reset = () => {
  // TODO: 列配置未恢复
  // TODO: 全选/全不选

  resetColumnsMap()
  initColumnsMap()
  initColumnsStore()
  changeColumns()
}

const checkChange = () => {
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

  const config = getColumnMapConfig(col[0].key)

  if (to === 'left') {
    col[0].fixed = 'left'
  } else if (to === 'right') {
    col[0].fixed = 'right'
  } else {
    col[0].fixed = undefined
  }

  config.fixed = col[0].fixed
  storeMap[to].push(...col)

  changeColumns()
}

function changeColumns() {
  const orderKeys: string[] = []
  ;[...columnsStore.leftColumns, ...columnsStore.autoColumns, ...columnsStore.rightColumns].forEach(
    (col, index) => {
      orderKeys.push(col.key)
      columnsMap.value[col.key] = {
        ...(columnsMap.value[col.key] || {}),
        fixed: col.fixed,
        order: index
      }
    }
  )

  emits('change', { ...columnsMap.value }, orderKeys)
}

function loopColumns(cols: any[]) {
  return cols.map(item => {
    const _col: any = {
      title: item.title,
      key: item.key,
      fixed: item.fixed,
      _rowKey: item.key
    }

    if (item.children) {
      _col.children = loopColumns(item.children)
    }
    return _col
  })
}
</script>
