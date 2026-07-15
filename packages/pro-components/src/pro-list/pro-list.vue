<template>
  <section
    ref="wrapperRef"
    class="pro-list"
    :class="[
      `is-${resolvedLayout}`,
      `is-${resolvedSize || 'default'}`,
      { 'is-bordered': resolvedBordered, 'is-split': split }
    ]"
  >
    <slot v-if="requestError" name="error" :error="requestError" :reload="reload">
      <el-alert class="pro-list__error" type="error" show-icon :closable="false">
        <template #title>
          <span>{{ resolvedErrorText }}</span>
          <el-button link type="danger" @click="retry">{{ retryText }}</el-button>
        </template>
      </el-alert>
    </slot>

    <slot v-if="mergedLoading && !listData.length" name="loading">
      <div class="pro-list__skeletons">
        <el-skeleton v-for="index in 3" :key="index" animated :rows="2" />
      </div>
    </slot>

    <slot v-else-if="!listData.length && !requestError" name="empty">
      <pro-empty :description="resolvedEmptyText" compact />
    </slot>

    <div
      v-else-if="listData.length"
      v-loading="mergedLoading"
      class="pro-list__items"
      :style="itemsStyle"
    >
      <article
        v-for="(record, index) in listData"
        :key="String(resolveRowKey(record))"
        class="pro-list__item"
        :class="{ 'is-selected': isSelected(record) }"
      >
        <el-checkbox
          v-if="selectable"
          class="pro-list__checkbox"
          :model-value="isSelected(record)"
          :aria-label="`选择第 ${index + 1} 项`"
          @change="checked => toggleSelection(record, Boolean(checked))"
        />
        <slot name="item" :record="record" :index="index" :selected="isSelected(record)">
          <el-avatar
            v-if="getItemValues(record, index).avatar"
            class="pro-list__avatar"
            :size="resolvedSize === 'small' ? 36 : 44"
            :src="String(getItemValues(record, index).avatar)"
          />
          <div class="pro-list__main">
            <div class="pro-list__title">
              <slot name="title" :record="record" :index="index">
                {{ getItemValues(record, index).title }}
              </slot>
            </div>
            <div v-if="getItemValues(record, index).description" class="pro-list__description">
              <slot name="description" :record="record" :index="index">
                {{ getItemValues(record, index).description }}
              </slot>
            </div>
            <div
              v-if="getItemValues(record, index).content || $slots.content"
              class="pro-list__content"
            >
              <slot name="content" :record="record" :index="index">
                {{ getItemValues(record, index).content }}
              </slot>
            </div>
          </div>
          <div v-if="$slots.actions" class="pro-list__actions">
            <slot name="actions" :record="record" :index="index" />
          </div>
        </slot>
      </article>
    </div>

    <div v-if="pagination !== false && total > 0" class="pro-list__pagination">
      <el-pagination
        :current-page="pageInfo.current"
        :page-size="pageInfo.pageSize"
        :total="total"
        :page-sizes="paginationProps.pageSizes"
        :layout="paginationProps.layout"
        :background="paginationProps.background"
        :small="paginationProps.small"
        :popper-class="paginationProps.popperClass"
        :teleported="paginationProps.teleported"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </section>
</template>

<script
  setup
  lang="ts"
  generic="
    TRecord extends object = Record<string, unknown>,
    TQuery extends object = Record<string, unknown>,
    TResponse = ProListRequestResult<TRecord>
  "
>
import { cloneDeep } from 'lodash-es'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { ElAlert, ElAvatar, ElButton, ElCheckbox, ElPagination, ElSkeleton } from 'element-plus'
import { ProEmpty } from '../pro-empty'
import { resolveProCardColumns } from '../pro-card'
import { useProConfigProvider } from '../pro-config-provider/pro-config-provider-context'
import { resolveProConfigProviderPopperClass } from '../pro-config-provider/pro-config-provider-utils'
import { isProRequestAbort, useProRequest, type ProRequestAction } from '../shared/pro-request'
import {
  getProListErrorText,
  getProListItemValues,
  normalizeProListResponse,
  paginateProListData
} from './pro-list-utils'
import { useProListSelection } from './use-pro-list-selection'
import type {
  ProListExpose,
  ProListPageInfo,
  ProListProps,
  ProListRequestParams,
  ProListRequestResult
} from './pro-list'

defineOptions({ name: 'ProList' })

const props = withDefaults(defineProps<ProListProps<TRecord, TQuery, TResponse>>(), {
  data: () => [],
  params: () => ({}) as TQuery,
  autoRequest: true,
  pagination: true,
  rowKey: 'id',
  itemMeta: () => ({}),
  gridColumns: () => ({ xs: 1, md: 2, xl: 3 }),
  gap: 16,
  split: true,
  selectable: false,
  selectedKeys: () => [],
  reserveSelection: false,
  retryText: '重新加载'
})
const emit = defineEmits<{
  'update:selectedKeys': [keys: Array<string | number>]
  'selection-change': [records: TRecord[]]
  'page-change': [current: number, pageSize: number]
  'pagination-change': [pageInfo: ProListPageInfo]
  'loading-change': [loading: boolean]
  'request-state-change': [lifecycle: ReturnType<typeof getRequestLifecycle>]
  'request-error': [error: unknown]
}>()
defineSlots<{
  item?: (scope: { record: TRecord; index: number; selected: boolean }) => unknown
  title?: (scope: { record: TRecord; index: number }) => unknown
  description?: (scope: { record: TRecord; index: number }) => unknown
  content?: (scope: { record: TRecord; index: number }) => unknown
  actions?: (scope: { record: TRecord; index: number }) => unknown
  loading?: () => unknown
  empty?: () => unknown
  error?: (scope: {
    error: unknown
    reload: (resetPage?: boolean) => Promise<TRecord[]>
  }) => unknown
}>()

const proConfig = useProConfigProvider()
const requestState = useProRequest<TResponse>()
const wrapperRef = ref<HTMLElement>()
const layoutWidth = ref(1200)
const listData = shallowRef<TRecord[]>([])
const total = ref(0)
const pageInfo = ref<ProListPageInfo>({
  current: typeof props.pagination === 'object' ? (props.pagination.current ?? 1) : 1,
  pageSize: typeof props.pagination === 'object' ? (props.pagination.pageSize ?? 10) : 10
})
let resizeObserver: ResizeObserver | undefined
const {
  selectedKeyList,
  resolveRowKey,
  isSelected,
  toggleSelection,
  clearSelection,
  syncSelectedKeys,
  cacheVisibleRecords,
  getSelectedRows
} = useProListSelection({
  data: listData,
  rowKey: () => props.rowKey,
  reserveSelection: () => props.reserveSelection,
  selectedKeys: () => props.selectedKeys,
  onChange: (keys, records) => {
    emit('update:selectedKeys', keys)
    emit('selection-change', records)
  }
})

const resolvedLayout = computed(() => props.layout ?? proConfig.value.list?.layout ?? 'list')
const resolvedSize = computed(
  () => props.size ?? proConfig.value.list?.size ?? proConfig.value.size
)
const resolvedBordered = computed(() => props.bordered ?? proConfig.value.list?.bordered ?? true)
const resolvedEmptyText = computed(
  () => props.emptyText ?? proConfig.value.list?.emptyText ?? '暂无列表数据'
)
const mergedLoading = computed(() => props.loading ?? requestState.loading.value)
const requestLifecycle = computed(() => ({
  phase: requestState.phase.value,
  action: requestState.action.value,
  loading: mergedLoading.value,
  initialLoading: requestState.initialLoading.value,
  refreshing: requestState.refreshing.value
}))
const requestError = computed(() => requestState.error.value)
const resolvedErrorText = computed(() => getProListErrorText(requestError.value, props.errorText))
const paginationProps = computed(() => {
  const config = typeof props.pagination === 'object' ? props.pagination : {}
  return {
    pageSizes: config.pageSizes ?? [10, 20, 50],
    layout: Array.isArray(config.layout)
      ? config.layout.join(',')
      : (config.layout ?? 'total, sizes, prev, pager, next, jumper'),
    background: config.background ?? true,
    small: config.small ?? resolvedSize.value === 'small',
    popperClass: resolveProConfigProviderPopperClass(proConfig.value.dark, config.popperClass),
    teleported: config.teleported ?? true
  }
})
const itemsStyle = computed(() => ({
  '--pro-list-columns':
    resolvedLayout.value === 'grid'
      ? resolveProCardColumns(props.gridColumns, layoutWidth.value)
      : 1,
  '--pro-list-gap': typeof props.gap === 'number' ? `${props.gap}px` : props.gap
}))

watch(requestState.loading, loading => emit('loading-change', loading), { immediate: true })
watch(requestLifecycle, lifecycle => emit('request-state-change', { ...lifecycle }), {
  immediate: true
})
watch(
  () => props.selectedKeys,
  keys => syncSelectedKeys(keys),
  { deep: true }
)
watch(
  [
    () => props.pagination !== false,
    () => (typeof props.pagination === 'object' ? props.pagination.current : undefined),
    () => (typeof props.pagination === 'object' ? props.pagination.pageSize : undefined)
  ],
  ([enabled, current, pageSize], [previousEnabled, previousCurrent, previousPageSize]) => {
    if (
      enabled === previousEnabled &&
      current === previousCurrent &&
      pageSize === previousPageSize
    ) {
      return
    }
    pageInfo.value = {
      current: current ?? pageInfo.value.current,
      pageSize: pageSize ?? pageInfo.value.pageSize
    }
    void loadData('page').catch(() => undefined)
  }
)
watch(
  [() => props.request, () => props.params, () => props.autoRequest],
  ([request, , autoRequest]) => {
    if ((request && autoRequest) || !request) void reload(true).catch(() => undefined)
  },
  { immediate: true, deep: true }
)
watch(
  () => props.data,
  () => {
    if (!props.request) void loadData('refresh')
  },
  { deep: true }
)

onMounted(() => {
  if (!wrapperRef.value || typeof ResizeObserver === 'undefined') return
  layoutWidth.value = wrapperRef.value.clientWidth || layoutWidth.value
  resizeObserver = new ResizeObserver(entries => {
    layoutWidth.value = entries[0]?.contentRect.width || layoutWidth.value
  })
  resizeObserver.observe(wrapperRef.value)
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  requestState.cancel()
})

function createRequestParams() {
  const params = { ...props.params, ...pageInfo.value } as ProListRequestParams<TQuery>
  const transform = props.transformParams ?? proConfig.value.list?.transformParams
  return transform ? (transform(params) as ProListRequestParams<TQuery>) : params
}

async function loadData(action: ProRequestAction = 'refresh') {
  if (!props.request) {
    const source = [...props.data]
    listData.value =
      props.pagination === false ? source : paginateProListData(source, pageInfo.value)
    total.value = source.length
    cacheVisibleRecords()
    return listData.value
  }

  try {
    const response = await requestState.execute(props.request, createRequestParams(), {
      action,
      debounce: props.requestDebounce,
      retry: props.requestRetry,
      retryDelay: props.requestRetryDelay
    })
    if (requestState.data.value !== response) return listData.value
    const adapter = props.responseAdapter ?? proConfig.value.list?.responseAdapter
    const result = adapter
      ? (adapter(response) as ProListRequestResult<TRecord>)
      : normalizeProListResponse(response as ProListRequestResult<TRecord>)
    listData.value = result.data
    total.value = result.total
    cacheVisibleRecords()
    return listData.value
  } catch (error) {
    if (!isProRequestAbort(error)) emit('request-error', error)
    throw error
  }
}

async function reload(resetPage = true) {
  if (resetPage) pageInfo.value = { ...pageInfo.value, current: 1 }
  return loadData(requestState.data.value === undefined ? 'initial' : 'reload')
}

function refresh() {
  return loadData('refresh')
}

function retryRequest() {
  return loadData('retry')
}

function retry() {
  void reload(false).catch(() => undefined)
}

async function setPageInfo(next: Partial<ProListPageInfo>, reloadData = true) {
  pageInfo.value = { ...pageInfo.value, ...next }
  emitPageChange()
  return reloadData ? refresh() : listData.value
}

async function handleCurrentChange(current: number) {
  await setPageInfo({ current })
}

async function handleSizeChange(pageSize: number) {
  await setPageInfo({ current: 1, pageSize })
}

function emitPageChange() {
  emit('page-change', pageInfo.value.current, pageInfo.value.pageSize)
  emit('pagination-change', { ...pageInfo.value })
}

function getRequestLifecycle() {
  return { ...requestLifecycle.value }
}

function getItemValues(record: TRecord, index: number) {
  return getProListItemValues(record, index, props.itemMeta)
}

const exposed: ProListExpose<TRecord> = {
  reload,
  refresh,
  getData: () => cloneDeep(listData.value),
  getLoading: () => mergedLoading.value,
  getRequestLifecycle,
  getError: () => requestError.value,
  retryRequest,
  cancelRequest: requestState.cancel,
  getTotal: () => total.value,
  getPageInfo: () => ({ ...pageInfo.value }),
  setPageInfo,
  getSelectedKeys: () => [...selectedKeyList.value],
  getSelectedRows,
  clearSelection
}
defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-list {
  min-width: 0;
  color: var(--el-text-color-primary);

  &__error {
    margin-bottom: 12px;

    :deep(.el-alert__title) {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  }

  &__skeletons {
    display: grid;
    gap: 20px;
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(var(--pro-list-columns), minmax(0, 1fr));
    gap: var(--pro-list-gap);
    min-width: 0;
  }

  &.is-list &__items {
    gap: 0;
  }

  &__item {
    display: flex;
    min-width: 0;
    align-items: flex-start;
    gap: 14px;
    padding: 18px;
    background: var(--el-bg-color-overlay);
    transition:
      background-color var(--el-transition-duration-fast),
      border-color var(--el-transition-duration-fast);
  }

  &.is-bordered &__item {
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--el-border-radius-base);
  }

  &.is-list.is-split &__item + &__item {
    border-top-color: transparent;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &.is-list.is-split &__item:not(:last-child) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &__item:hover,
  &__item.is-selected {
    background: var(--el-fill-color-light);
  }

  &__item.is-selected {
    border-color: var(--el-color-primary-light-5);
  }

  &__checkbox,
  &__avatar {
    flex: none;
  }

  &__main {
    min-width: 0;
    flex: 1;
  }

  &__title {
    overflow-wrap: anywhere;
    font-weight: 600;
  }

  &__description,
  &__content {
    margin-top: 6px;
    overflow-wrap: anywhere;
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
    line-height: 1.6;
  }

  &__content {
    color: var(--el-text-color-regular);
  }

  &__actions {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  &__pagination {
    display: flex;
    min-width: 0;
    justify-content: flex-end;
    padding-top: 16px;
    overflow-x: auto;
  }

  &.is-small &__item {
    gap: 10px;
    padding: 12px;
  }

  @media (max-width: 640px) {
    &__item {
      flex-wrap: wrap;
    }

    &__actions {
      width: 100%;
      justify-content: flex-start;
      padding-left: 30px;
    }
  }
}
</style>
