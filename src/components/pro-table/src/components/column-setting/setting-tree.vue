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
      :expand-on-click-node="false"
      @node-drag-end="handleDragEnd"
    >
      <template #default="{ node }">
        <div class="setting-tree__node">
          <span>{{ node.label }}</span>
          <span class="tools" v-if="node.level === 1">
            <el-space>
              <el-tooltip
                v-if="fixed !== 'auto'"
                effect="dark"
                content="不固定"
                placement="top-start"
              >
                <el-icon @click="moveToAuto(node)"><Sort /></el-icon>
              </el-tooltip>

              <el-tooltip
                v-if="fixed !== 'left'"
                effect="dark"
                content="固定在列首"
                placement="top-start"
              >
                <el-icon @click="moveToLeft(node)"><Upload /></el-icon>
              </el-tooltip>

              <el-tooltip
                v-if="fixed !== 'right'"
                effect="dark"
                content="固定在列尾"
                placement="top-start"
              >
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
import { definePropType } from '@/utils'
import { Download, Upload, Sort } from '@element-plus/icons-vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { inject } from 'vue'

const emits = defineEmits({
  change: (fixed: 'auto' | 'left' | 'right', columns: any[]) => columns,
  move: (from: 'auto' | 'left' | 'right', to: 'auto' | 'left' | 'right', node: any) =>
    from && to && node
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
    type: definePropType<'auto' | 'left' | 'right'>(String),
    default: 'auto'
  }
})

const change = () => {
  emits('change', props.fixed, props.columns)
}
const moveToLeft = (node: any) => {
  emits('move', props.fixed, 'left', node)

  // emits()
}

const moveToAuto = (node: any) => {
  emits('move', props.fixed, 'auto', node)
}

const moveToRight = (node: any) => {
  emits('move', props.fixed, 'right', node)
}

const handleDragEnd = (draggingNode: Node, dropNode: Node) => {
  console.log('draggingNode', draggingNode)
  console.log('dropNode', dropNode)

  change()
}

const allowDrop = (draggingNode: Node, dropNode: Node, type: 'next' | 'prev') => {
  if (draggingNode.level === dropNode.level && ['next', 'prev'].includes(type)) {
    return true
  }
  return false
}
const allowDrag = (draggingNode: Node) => {
  if (draggingNode.level > 1) return false
  return true
}
</script>
<style lang="scss" scoped>
.setting-tree {
  &__header {
    padding-left: 18px;
    margin-bottom: 10px;
  }

  &__node {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tools {
      display: none;
    }
    &:hover {
      .tools {
        display: block;
      }
    }
  }
}
</style>
