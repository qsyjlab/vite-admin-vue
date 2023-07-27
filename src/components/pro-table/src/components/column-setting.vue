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
        style="margin-bottom: 20px"
        title="固定在左侧"
        :columns="columnsState.leftColumns"
      ></setting-tree>
      <setting-tree
        style="margin-bottom: 20px"
        title="不固定"
        :columns="columnsState.autoColumns"
      ></setting-tree>
      <setting-tree
        style="margin-bottom: 20px"
        title="固定在右侧"
        :columns="columnsState.rightColumns"
      ></setting-tree>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
// import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
// import type { NodeDropType } from 'element-plus/es/components/tree/src/tree.type'
import { Setting, Download, Upload } from '@element-plus/icons-vue'
import { computed, ref, toRaw, watch, reactive, provide } from 'vue'

import SettingTree from './column-setting/setting-tree.vue'

const emits = defineEmits({
  change: (columns: any) => columns
})

const props = defineProps<{
  columns?: any[]
}>()

const triggerRef = ref<HTMLDivElement>()
const popoverRef = ref()

const columnsState = reactive<{
  leftColumns: any[]
  autoColumns: any[]
  rightColumns: any[]
}>({
  leftColumns: [],
  autoColumns: [],
  rightColumns: []
})

watch(
  () => props.columns,
  () => {
    columnsState.leftColumns = buildColumns(props.columns?.filter(i => i?.fixed === 'left') || [])
    columnsState.autoColumns = buildColumns(props.columns?.filter(i => !i.fixed) || [])
    columnsState.rightColumns = buildColumns(props.columns?.filter(i => i?.fixed === 'right') || [])
  },
  {
    immediate: true
  }
)

function buildColumns(cols: any[]) {
  return cols.map((item, index) => {
    const _col: any = {
      title: item.title,
      key: item.key,
      fixed: item.fixed,
      _rowKey: `${item.key}-${index}`
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
