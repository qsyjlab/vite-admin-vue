<template>
  <div class="pro-table-column-setting">
    <div class="pro-table-column-setting__header">
      <el-checkbox
        :model-value="allVisible"
        :indeterminate="partiallyVisible"
        @change="setAllVisible(Boolean($event))"
      >
        列展示
      </el-checkbox>
      <el-button link type="primary" @click="$emit('reset')">重置</el-button>
    </div>

    <el-tree
      :data="columns"
      node-key="key"
      default-expand-all
      draggable
      :expand-on-click-node="false"
      :allow-drop="allowDrop"
      @node-drop="handleNodeDrop"
    >
      <template #default="{ data }">
        <div class="pro-table-column-setting__node">
          <el-icon class="pro-table-column-setting__drag" aria-label="拖拽调整列顺序">
            <Rank />
          </el-icon>
          <el-checkbox
            class="pro-table-column-setting__checkbox"
            :model-value="columnState[data.key]?.show !== false"
            @click.stop
            @change="$emit('visible-change', data.key, Boolean($event))"
          >
            {{ data.title || data.key }}
          </el-checkbox>
          <span class="pro-table-column-setting__fixed" @mousedown.stop @click.stop>
            <el-tooltip content="固定在列首" placement="top">
              <el-button
                text
                circle
                size="small"
                :class="{ 'is-active': columnState[data.key]?.fixed === 'left' }"
                :icon="Top"
                @click="toggleFixed(data.key, 'left')"
              />
            </el-tooltip>
            <el-tooltip content="固定在列尾" placement="top">
              <el-button
                text
                circle
                size="small"
                :class="{ 'is-active': columnState[data.key]?.fixed === 'right' }"
                :icon="Bottom"
                @click="toggleFixed(data.key, 'right')"
              />
            </el-tooltip>
          </span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bottom, Rank, Top } from '@element-plus/icons-vue'
import type { ProTableColumnState } from '../pro-table'
import type { ProTableColumnSettingNode } from '../hooks/use-pro-table-columns'

interface TreeNodeLike {
  data: ProTableColumnSettingNode
  parent?: TreeNodeLike
  childNodes: TreeNodeLike[]
}

const props = defineProps<{
  columns: ProTableColumnSettingNode[]
  columnState: Record<string, ProTableColumnState>
}>()

const emit = defineEmits<{
  reset: []
  'visible-change': [key: string, visible: boolean]
  'fixed-change': [key: string, fixed: 'left' | 'right' | undefined]
  reorder: [keys: string[]]
}>()

const flatColumns = computed(() => flattenColumns(props.columns))
const visibleCount = computed(
  () => flatColumns.value.filter(column => props.columnState[column.key]?.show !== false).length
)
const allVisible = computed(
  () => flatColumns.value.length > 0 && visibleCount.value === flatColumns.value.length
)
const partiallyVisible = computed(
  () => visibleCount.value > 0 && visibleCount.value < flatColumns.value.length
)

function flattenColumns(columns: ProTableColumnSettingNode[]): ProTableColumnSettingNode[] {
  return columns.flatMap(column => [column, ...flattenColumns(column.children ?? [])])
}

function setAllVisible(visible: boolean) {
  flatColumns.value.forEach(column => emit('visible-change', column.key, visible))
}

function toggleFixed(key: string, fixed: 'left' | 'right') {
  emit('fixed-change', key, props.columnState[key]?.fixed === fixed ? undefined : fixed)
}

function allowDrop(draggingNode: TreeNodeLike, dropNode: TreeNodeLike, type: string) {
  return type !== 'inner' && draggingNode.parent === dropNode.parent
}

function handleNodeDrop(_draggingNode: TreeNodeLike, dropNode: TreeNodeLike) {
  const keys = dropNode.parent?.childNodes.map(node => node.data.key) ?? []
  if (keys.length) emit('reorder', keys)
}
</script>

<style scoped lang="scss">
.pro-table-column-setting {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-tree) {
    max-height: 360px;
    padding-top: 6px;
    overflow-y: auto;
    color: var(--el-text-color-primary);
  }

  :deep(.el-tree-node__content) {
    height: 36px;
    border-radius: var(--el-border-radius-base);

    &:hover {
      background: var(--el-fill-color-light);
    }
  }

  &__node {
    display: flex;
    min-width: 0;
    flex: 1;
    align-items: center;
    gap: 8px;
    padding-right: 2px;
  }

  &__drag {
    flex: none;
    color: var(--el-text-color-placeholder);
    cursor: grab;
  }

  &__checkbox {
    min-width: 0;
    flex: 1;
  }

  &__fixed {
    display: inline-flex;
    flex: none;
    align-items: center;

    :deep(.el-button) {
      color: var(--el-text-color-secondary);

      &.is-active {
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
      }
    }
  }
}
</style>
