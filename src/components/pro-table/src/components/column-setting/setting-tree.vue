<template>
  <div class="setting-tree">
    <div class="setting-tree__header">{{ title }}</div>
    <el-tree
      ref="treeRef"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :data="columns"
      :default-checked-keys="defaultCheckedKeys"
      show-checkbox
      draggable
      node-key="_rowKey"
      :props="{
        label: 'title',
        children: 'children'
      }"
      :expand-on-click-node="false"
      @node-drag-end="handleDragEnd"
      @check="check"
    >
      <template #default="{ node }">
        <div class="setting-tree__node">
          <span>{{ node.label }}</span>
          <span v-if="node.level === 1" class="tools">
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
import type { TreeInstance } from './column-setting'
import { ref, reactive, watch } from 'vue'
import { nextTick } from 'vue'
import { useTableStoreContext } from '../../store'

const emits = defineEmits({
  change: (fixed: 'auto' | 'left' | 'right', columns: any[]) => columns && fixed,
  check: () => true,
  move: (from: 'auto' | 'left' | 'right', to: 'auto' | 'left' | 'right', node: any) =>
    from && to && node
})

const treeRef = ref<TreeInstance>()

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
  },
  defaultCheckedKeys: {
    type: definePropType<string[] | number[]>(Array),
    default: () => []
  }
})

const columnsState = reactive<{
  map: any
  columns: any[]
  checkedKeys: string[]
}>({
  map: new Map(),
  columns: [],
  checkedKeys: []
})
const { columnsSettingUtils, columnsMap } = useTableStoreContext()
watch(
  [() => props.columns, columnsMap],
  () => {
    if (props.columns.length === 0) return
    const map = new Map()
    const checkedKeys: string[] = []

    const loopColumnsMap = (columns: any) => {
      columns.forEach((item: any) => {
        map.set(item.key, item)
        if (item.children) {
          loopColumnsMap(item.children)
        }
      })
    }

    function loopColumns(cols: any[]) {
      return cols.map(item => {
        const _col: any = {
          title: item.title,
          key: item.key,
          fixed: item.fixed,
          _rowKey: item.key
        }

        const config = columnsMap.value[item.key] || { show: true }

        if (!item.children?.length && config?.show !== false) {
          checkedKeys.push(item.key)
        }

        if (item.children?.length) {
          _col.children = loopColumns(item.children)
          if (_col.children.every((c: any) => checkedKeys.includes(c.key))) {
            checkedKeys.push(_col.key)
          }
        }

        return _col
      })
    }

    loopColumnsMap([...props.columns])

    columnsState.map = map
    columnsState.columns = loopColumns([...props.columns])
    columnsState.checkedKeys = checkedKeys
    setCheckedKeys(checkedKeys)
  },
  {
    deep: true,
    immediate: true
  }
)

const check = (data: any, checkedObj: any) => {
  const { checkedKeys = [] } = checkedObj || {}
  const checked = checkedKeys.includes(data.key)

  const newColumnMap = { ...columnsMap.value }

  const loopSetShow = (key: string | number) => {
    const newSetting = { ...newColumnMap[key] }
    newSetting.show = checked

    // 如果含有子节点，也要选中
    if (columnsState.map?.get(key)?.children) {
      columnsState.map.get(key)?.children?.forEach((item: any) => loopSetShow(item.key))
    }
    newColumnMap[key] = newSetting
  }

  loopSetShow(data.key)
  columnsSettingUtils.mergeColumnsMap({ ...newColumnMap })
  emits('check')
}

const change = () => {
  emits('change', props.fixed, props.columns)
}
const moveToLeft = (node: any) => {
  emits('move', props.fixed, 'left', node)
}

const moveToAuto = (node: any) => {
  emits('move', props.fixed, 'auto', node)
}

const moveToRight = (node: any) => {
  emits('move', props.fixed, 'right', node)
}

const handleDragEnd = () => {
  change()
}

function setCheckedKeys(keys: string[]) {
  nextTick(() => {
    treeRef.value?.setCheckedKeys(keys)
  })
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
