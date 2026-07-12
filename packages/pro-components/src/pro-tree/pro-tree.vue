<template>
  <div class="pro-tree">
    <el-input
      v-if="searchable"
      v-model="keyword"
      class="pro-tree__search"
      clearable
      :placeholder="searchPlaceholder"
      :prefix-icon="Search"
    />
    <el-tree
      ref="treeRef"
      :data="data"
      :props="treeProps"
      :node-key="nodeKey"
      :show-checkbox="checkable"
      :default-checked-keys="modelValue"
      :current-node-key="currentKey"
      :default-expand-all="defaultExpandAll"
      :expand-on-click-node="expandOnClickNode"
      :lazy="lazy"
      :load="load"
      :filter-node-method="filterNode"
      highlight-current
      @check="handleCheck"
      @current-change="handleCurrentChange"
    >
      <template #default="scope"
        ><slot v-bind="scope">{{ scope.node.label }}</slot></template
      >
    </el-tree>
  </div>
</template>

<script setup lang="ts" generic="TNode extends object = Record<string, unknown>">
import { computed, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElInput, ElTree, type TreeInstance } from 'element-plus'
import { getProPathValue } from '../shared/pro-path'
import type { ProTreeExpose, ProTreeProps } from './pro-tree'

defineOptions({ name: 'ProTree' })
const props = withDefaults(defineProps<ProTreeProps<TNode>>(), {
  data: () => [],
  fields: () => ({}),
  nodeKey: 'id',
  modelValue: () => [],
  checkable: false,
  searchable: false,
  searchPlaceholder: '搜索节点',
  defaultExpandAll: false,
  expandOnClickNode: true,
  lazy: false
})
const emit = defineEmits<{
  'update:model-value': [keys: Array<string | number>]
  'update:current-key': [key?: string | number]
  check: [nodes: TNode[], keys: Array<string | number>]
  select: [data: TNode, key?: string | number]
}>()
defineSlots<{ default?: (scope: { node: unknown; data: TNode }) => unknown }>()
const treeRef = ref<TreeInstance>()
const keyword = ref('')
const treeProps = computed(() => ({
  label: String(props.fields.label ?? 'label'),
  children: String(props.fields.children ?? 'children'),
  disabled: String(props.fields.disabled ?? 'disabled')
}))
watch(keyword, value => treeRef.value?.filter(value))
watch(
  () => props.modelValue,
  keys => treeRef.value?.setCheckedKeys(keys),
  { deep: true }
)

function filterNode(value: string, data: Record<string, unknown>) {
  if (!value) return true
  if (props.filter) return props.filter(value, data as TNode)
  return String(getProPathValue(data, String(props.fields.label ?? 'label')) ?? '')
    .toLowerCase()
    .includes(value.toLowerCase())
}
function handleCheck(
  _: TNode,
  state: { checkedKeys: Array<string | number>; checkedNodes: TNode[] }
) {
  emit('update:model-value', state.checkedKeys)
  emit('check', state.checkedNodes, state.checkedKeys)
}
function handleCurrentChange(data: TNode) {
  const key = getProPathValue<string | number>(data, String(props.fields.key ?? props.nodeKey))
  emit('update:current-key', key)
  emit('select', data, key)
}
function setExpanded(expanded: boolean) {
  props.data.forEach(node => {
    const key = getProPathValue<string | number>(node, String(props.fields.key ?? props.nodeKey))
    const treeNode = key === undefined ? undefined : treeRef.value?.getNode(key)
    if (treeNode) treeNode.expanded = expanded
  })
}
const exposed: ProTreeExpose<TNode> = {
  filter: value => treeRef.value?.filter(value),
  getCheckedKeys: () => treeRef.value?.getCheckedKeys() as Array<string | number>,
  getCheckedNodes: () => treeRef.value?.getCheckedNodes() as TNode[],
  setCheckedKeys: keys => treeRef.value?.setCheckedKeys(keys),
  getCurrentKey: () => treeRef.value?.getCurrentKey() as string | number | undefined,
  setCurrentKey: key => treeRef.value?.setCurrentKey(key),
  expandAll: () => setExpanded(true),
  collapseAll: () => setExpanded(false)
}
defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-tree {
  min-width: 0;
}
.pro-tree__search {
  margin-bottom: 12px;
}
</style>
