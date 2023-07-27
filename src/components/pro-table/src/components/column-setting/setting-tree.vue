<template>
  <div class="setting-tree">
    <div class="setting-tree__header">{{ title }}</div>
    <el-tree
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :data="columns"
      show-checkbox
      draggable
      default-expand-all
      node-key="_rowKey"
      :props="{
        label: 'title',
        children: 'children'
      }"
      @node-drag-end="handleDragEnd"
    >
      <template #default="{ node }">
        <div
          style="width: 100%; display: flex; align-items: center; justify-content: space-between"
        >
          <span>{{ node.label }}</span>
          <span>
            <el-space>
              <el-tooltip effect="dark" content="固定在列首" placement="top-start">
                <el-icon @click="moveToLeft(node)"><Upload /></el-icon>
              </el-tooltip>

              <el-tooltip effect="dark" content="固定在列尾" placement="top-start">
                <el-icon @click="moveToRight(node)"><Download /></el-icon>
              </el-tooltip>
            </el-space>
          </span>
        </div>
      </template>
    </el-tree>
  </div>
</template>
<script setup lang="ts">
import { Download, Upload } from '@element-plus/icons-vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { inject } from 'vue'

const emits = defineEmits({
  change: (columns: any[]) => columns
})

const state = inject('state')
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  columns: {
    type: Array,
    default: () => []
  },
  // left | auto |  right
  fixed: {
    type: String,
    default: 'auto'
  }
})

const changeFixed = () => {}
const moveToLeft = (node: any) => {}
const moveToRight = (node: any) => {}

const handleDragEnd = () => {
  // emits('change', props.columns)
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
<style lang="scss" scoped>
.setting-tree {
  &__header {
    padding-left: 18px;
    margin-bottom: 10px;
  }
}
</style>
