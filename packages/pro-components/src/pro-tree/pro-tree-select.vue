<template>
  <el-tree-select
    v-model="value"
    :data="renderedData"
    :cache-data="mergedCacheData"
    :props="treeProps"
    :node-key="nodeKey"
    :multiple="multiple"
    :check-strictly="checkStrictly"
    :lazy="lazy"
    :load="load"
    :loading="mergedLoading"
    :render-after-expand="false"
    filterable
    clearable
    v-bind="$attrs"
  >
    <template #empty>
      <slot name="empty" :error="requestError" :retry="handleRetryRequest">
        <pro-empty
          :status="requestError ? 'error' : 'empty'"
          :description="requestErrorDescription"
          :action-text="requestError ? '重试' : undefined"
          compact
          @action="handleRetryRequest"
        />
      </slot>
    </template>
  </el-tree-select>
</template>

<script setup lang="ts" generic="TNode extends object = Record<string, unknown>">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { ElTreeSelect } from 'element-plus'
import ProEmpty from '../pro-empty/pro-empty.vue'
import { isProRequestAbort, useProRequest } from '../shared/pro-request'
import type { ProTreeSelectExpose, ProTreeSelectProps, ProTreeSelectValue } from './pro-tree'
import { mergeProTreeSelectCacheData } from './pro-tree-select-utils'

defineOptions({ name: 'ProTreeSelect', inheritAttrs: false })
const props = withDefaults(defineProps<ProTreeSelectProps<TNode>>(), {
  data: () => [],
  cacheData: () => [],
  fields: () => ({}),
  nodeKey: 'id',
  multiple: false,
  checkStrictly: false,
  lazy: false
})
const emit = defineEmits<{
  'update:model-value': [value: ProTreeSelectValue | undefined]
  change: [value: ProTreeSelectValue | undefined]
  'request-success': [data: TNode[]]
  'path-request-success': [data: TNode[]]
  'request-state-change': [lifecycle: ReturnType<typeof getRequestLifecycle>]
  'request-error': [error: unknown]
}>()
defineSlots<{
  empty?: (scope: { error: unknown; retry: () => Promise<void> }) => unknown
}>()
const requestState = useProRequest<TNode[]>()
const pathRequestState = useProRequest<TNode[]>()
const requestData = shallowRef<TNode[]>()
const pathData = shallowRef<TNode[]>([])
const value = computed({
  get: () => props.modelValue,
  set: next => {
    emit('update:model-value', next)
    emit('change', next)
  }
})
const renderedData = computed(() => requestData.value ?? props.data)
const mergedCacheData = computed(() =>
  mergeProTreeSelectCacheData([props.cacheData, pathData.value], props.nodeKey)
)
const mergedLoading = computed(() =>
  Boolean(props.loading || requestState.loading.value || pathRequestState.loading.value)
)
const requestError = computed(() => requestState.error.value ?? pathRequestState.error.value)
const requestErrorDescription = computed(() => {
  if (requestError.value instanceof Error && requestError.value.message) {
    return requestError.value.message
  }
  return undefined
})
const requestLifecycle = computed(() => {
  const activeState = requestState.loading.value ? requestState : pathRequestState
  const error = requestState.error.value ?? pathRequestState.error.value
  const phase = mergedLoading.value
    ? 'pending'
    : error
      ? 'error'
      : requestState.phase.value === 'success' || pathRequestState.phase.value === 'success'
        ? 'success'
        : 'idle'
  return {
    phase,
    action: activeState.action.value,
    loading: mergedLoading.value,
    initialLoading: requestState.initialLoading.value || pathRequestState.initialLoading.value,
    refreshing: requestState.refreshing.value || pathRequestState.refreshing.value
  } as const
})
const treeProps = computed(() => ({
  value: String(props.fields.key ?? props.nodeKey),
  label: String(props.fields.label ?? 'label'),
  children: String(props.fields.children ?? 'children'),
  disabled: String(props.fields.disabled ?? 'disabled')
}))

async function reload() {
  if (!props.request) return renderedData.value
  try {
    const data = await requestState.execute((_, context) => props.request!(context), undefined, {
      action: requestData.value === undefined ? 'initial' : 'refresh'
    })
    requestData.value = data
    emit('request-success', data)
    return data
  } catch (error) {
    if (!isProRequestAbort(error)) emit('request-error', error)
    throw error
  }
}

async function reloadPath() {
  if (!props.pathRequest || !hasValue(props.modelValue)) {
    pathData.value = []
    return pathData.value
  }
  try {
    const data = await pathRequestState.execute(
      (_, context) => props.pathRequest!(props.modelValue!, context),
      undefined,
      { action: pathData.value.length ? 'refresh' : 'initial' }
    )
    pathData.value = data
    emit('path-request-success', data)
    return data
  } catch (error) {
    if (!isProRequestAbort(error)) emit('request-error', error)
    throw error
  }
}

async function retryRequest() {
  if (pathRequestState.error.value) return reloadPath()
  return reload()
}

async function handleRetryRequest() {
  try {
    await retryRequest()
  } catch {
    return
  }
}

function getRequestLifecycle() {
  return { ...requestLifecycle.value }
}

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
watch(
  () => [props.modelValue, props.pathRequest] as const,
  () => void reloadPath().catch(ignoreRequestError),
  { deep: true, immediate: true }
)
watch(requestLifecycle, lifecycle => emit('request-state-change', { ...lifecycle }), {
  immediate: true
})

onBeforeUnmount(() => {
  requestState.cancel()
  pathRequestState.cancel()
})

const exposed: ProTreeSelectExpose<TNode> = {
  getData: () => [...renderedData.value],
  getCacheData: () => [...mergedCacheData.value],
  getRequestLifecycle,
  getError: () => requestState.error.value ?? pathRequestState.error.value,
  retryRequest,
  cancelRequest: reason => {
    requestState.cancel(reason)
    pathRequestState.cancel(reason)
  },
  reload,
  reloadPath
}

defineExpose(exposed)

function hasValue(currentValue: ProTreeSelectValue | undefined) {
  return Array.isArray(currentValue) ? currentValue.length > 0 : currentValue !== undefined
}

function ignoreRequestError() {
  return undefined
}
</script>
