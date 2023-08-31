<template>
  <el-tooltip effect="dark" content="列设置" placement="top">
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
              :model-value="colSettingChecked.checked"
              label="列设置"
              size="large"
              :indeterminate="colSettingChecked.indeterminate"
              @change="colSettingCheckChange"
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
import { Setting } from '@element-plus/icons-vue'
import { ref, watch, reactive, nextTick } from 'vue'
import { useTableStoreContext } from '../../store'
import SettingTree from './setting-tree.vue'
import { columnsSort } from '../../utils'

const emits = defineEmits({
  change: (columnsMap: any) => columnsMap
})

const props = defineProps<{
  columns: any[]
}>()

const {
  mergeColumnsMap,
  columnsMap,
  getColumnMapConfig,
  setDefaultColumnsMap,
  resetColumnsMap,
  initLocalStorageOrDynamicMap
} = useTableStoreContext()

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

// watch(
//   () => props.columns,
//   () => {
//     initColumnsStore()
//   },
//   {
//     immediate: true,
//     deep: true
//   }
// )

watch(
  columnsMap,
  () => {
    // TODO: 似乎还存在问题
    const unChecked = Object.values(columnsMap.value).filter(
      value => !value || value.show === false
    )

    const rootUnChecked = props.columns.filter(col => {
      const config = columnsMap.value[col.key]
      return !config || config.show === false
    })

    colSettingChecked.indeterminate =
      unChecked.length !== 0 && rootUnChecked.length !== props.columns.length
    colSettingChecked.checked = unChecked.length === 0 && props.columns.length !== unChecked.length
  },
  {
    immediate: true
  }
)

const colSettingCheckChange = (val: any) => {
  setAllSelectAction(val)
}

const setAllSelectAction = (show = true) => {
  const columnKeyMap: Record<string, any> = {}
  const loopColumns = (columns: any) => {
    columns.forEach(({ key, fixed, index, children }: any) => {
      const columnKey: string = key
      if (columnKey) {
        columnKeyMap[columnKey] = {
          // 子节点 disable 时，不修改节点显示状态
          // : disable ? columnsMap[columnKey]?.show : show,
          show,
          fixed,
          order: columnsMap.value[columnKey]?.order
        }
      }
      if (children) {
        loopColumns(children)
      }
    })
  }
  loopColumns(props.columns)
  mergeColumnsMap(columnKeyMap)
}

function initColumnsMap() {
  const _columnsMap: Record<string, any> = {}
  props.columns.forEach((col, index) => {
    _columnsMap[col.key] = {
      order: index,
      show: _columnsMap[col.key]?.show === false ? false : true,
      fixed: col.fixed
    }
  })

  initLocalStorageOrDynamicMap({ ..._columnsMap })

  setDefaultColumnsMap({ ..._columnsMap })
  initColumnsStore()
}

function initColumnsStore() {
  const newColumns = loopColumns([...props.columns]).sort(columnsSort(columnsMap.value))

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
  const newColumnsMap: any = {}
  ;[...columnsStore.leftColumns, ...columnsStore.autoColumns, ...columnsStore.rightColumns].forEach(
    (col, index) => {
      newColumnsMap[col.key] = {
        ...(columnsMap.value[col.key] || {}),
        fixed: col.fixed,
        order: index
      }
    }
  )

  mergeColumnsMap(newColumnsMap)

  emits('change', { ...columnsMap.value })
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
