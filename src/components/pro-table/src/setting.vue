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
      <el-tree
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        :data="_columns"
        show-checkbox
        draggable
        default-expand-all
        node-key="_rowKey"
        :props="{
          label: 'title'
        }"
        @node-drag-end="handleDragEnd"
      />
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { NodeDropType } from 'element-plus/es/components/tree/src/tree.type'
import { Setting } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  columns?: any[]
}>()

const triggerRef = ref<HTMLDivElement>()
const popoverRef = ref()

const _columns = computed(() => {
  return props.columns?.map((item, index) => {
    return {
      ...item,
      _rowKey: `${item.key}-${index}`
    }
  })
})

const handleDragEnd = (
  draggingNode: Node,
  dropNode: Node,
  dropType: NodeDropType,
  ev: DragEvents
) => {
  console.log('tree drag end:', dropNode, dropType)
}

const allowDrop = (draggingNode: Node, dropNode: Node, type: 'next' | 'prev') => {
  if (draggingNode.level === dropNode.level && ['next', 'prev'].includes(type)) {
    return true
  }
  return false
}
const allowDrag = (draggingNode: Node) => {
  return true
}
</script>
