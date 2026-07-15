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
    <el-alert
      v-if="requestError && renderedData.length"
      class="pro-tree__error"
      type="error"
      :title="resolvedErrorText"
      :closable="false"
      show-icon
    >
      <template #default>
        <el-button link type="danger" @click="handleRetryRequest">{{ retryText }}</el-button>
      </template>
    </el-alert>
    <slot
      v-if="requestError && !renderedData.length"
      name="error"
      :error="requestError"
      :retry="handleRetryRequest"
    >
      <pro-empty
        status="error"
        title="组织数据加载失败"
        :description="resolvedErrorText"
        :action-text="retryText"
        compact
        @action="handleRetryRequest"
      />
    </slot>
    <slot v-else-if="!mergedLoading && !renderedData.length" name="empty">
      <pro-empty :description="emptyText" compact />
    </slot>
    <el-tree
      v-else
      ref="treeRef"
      v-loading="mergedLoading"
      :data="renderedData"
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
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElAlert, ElButton, ElInput, ElTree, type TreeInstance } from 'element-plus'
import ProEmpty from '../pro-empty/pro-empty.vue'
import { getProPathValue } from '../shared/pro-path'
import { isProRequestAbort, useProRequest } from '../shared/pro-request'
import type { ProTreeExpose, ProTreeProps, ProTreeRequestLifecycle } from './pro-tree'

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
  lazy: false,
  emptyText: '当前没有可展示的节点',
  retryText: '重新加载'
})
const emit = defineEmits<{
  'update:model-value': [keys: Array<string | number>]
  'update:current-key': [key?: string | number]
  check: [nodes: TNode[], keys: Array<string | number>]
  select: [data: TNode, key?: string | number]
  'request-success': [data: TNode[]]
  'request-state-change': [lifecycle: ProTreeRequestLifecycle]
  'request-error': [error: unknown]
}>()
defineSlots<{
  default?: (scope: { node: unknown; data: TNode }) => unknown
  empty?: () => unknown
  error?: (scope: { error: unknown; retry: () => Promise<void> }) => unknown
}>()
const treeRef = ref<TreeInstance>()
const keyword = ref('')
const requestData = shallowRef<TNode[]>()
const requestState = useProRequest<TNode[]>()
const renderedData = computed(() => requestData.value ?? props.data)
const mergedLoading = computed(() => Boolean(props.loading || requestState.loading.value))
const requestError = computed(() => requestState.error.value)
const requestLifecycle = computed<ProTreeRequestLifecycle>(() => ({
  phase: requestState.phase.value,
  action: requestState.action.value,
  loading: mergedLoading.value,
  initialLoading: requestState.initialLoading.value,
  refreshing: requestState.refreshing.value
}))
const resolvedErrorText = computed(() => {
  if (typeof props.errorText === 'function') return props.errorText(requestError.value)
  if (props.errorText) return props.errorText
  if (requestError.value instanceof Error && requestError.value.message) {
    return requestError.value.message
  }
  return '组织数据加载失败，请稍后重试'
})
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
watch(
  () => props.request,
  request => {
    if (request) void reload().catch(ignoreRequestError)
    else {
      requestState.cancel()
      requestData.value = undefined
    }
  },
  { immediate: true }
)
watch(requestLifecycle, lifecycle => emit('request-state-change', { ...lifecycle }), {
  immediate: true
})

onBeforeUnmount(requestState.cancel)

async function reload() {
  if (!props.request) return renderedData.value
  try {
    const data = await requestState.execute((_, context) => props.request!(context), undefined, {
      action: requestData.value === undefined ? 'initial' : 'reload',
      debounce: props.requestDebounce,
      retry: props.requestRetry,
      retryDelay: props.requestRetryDelay
    })
    requestData.value = data
    emit('request-success', data)
    return data
  } catch (error) {
    if (!isProRequestAbort(error)) emit('request-error', error)
    throw error
  }
}

async function retryRequest() {
  return reload()
}

async function handleRetryRequest() {
  try {
    await retryRequest()
  } catch {
    return
  }
}

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
  walkTree(renderedData.value, node => {
    const key = getProPathValue<string | number>(node, String(props.fields.key ?? props.nodeKey))
    const treeNode = key === undefined ? undefined : treeRef.value?.getNode(key)
    if (treeNode) treeNode.expanded = expanded
  })
}
const exposed: ProTreeExpose<TNode> = {
  getTree: () => treeRef.value,
  getData: () => [...renderedData.value],
  getRequestLifecycle: () => ({ ...requestLifecycle.value }),
  getError: () => requestError.value,
  retryRequest,
  cancelRequest: requestState.cancel,
  reload,
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

function walkTree(nodes: TNode[], callback: (node: TNode) => void) {
  for (const node of nodes) {
    callback(node)
    const children = getProPathValue<unknown>(node, String(props.fields.children ?? 'children'))
    if (Array.isArray(children)) walkTree(children as TNode[], callback)
  }
}

function ignoreRequestError() {
  return undefined
}
</script>

<style scoped lang="scss">
.pro-tree {
  min-width: 0;
}
.pro-tree__search {
  margin-bottom: 12px;
}

.pro-tree__error {
  margin-bottom: 12px;
}

:deep(.el-loading-mask) {
  background-color: color-mix(in srgb, var(--el-bg-color-overlay) 82%, transparent);
}
</style>
