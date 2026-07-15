<template>
  <div ref="wrapperRef" class="pro-descriptions">
    <div v-if="hasHeader" class="pro-descriptions__header">
      <div class="pro-descriptions__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="pro-descriptions__extra">
        <slot
          name="extra"
          :data="currentData"
          :reload="reload"
          :collapsed="effectiveCollapsed"
          :toggle-collapse="toggleCollapse"
        />
        <slot
          v-if="canCollapse"
          name="collapse"
          :collapsed="effectiveCollapsed"
          :toggle-collapse="toggleCollapse"
        >
          <el-button link type="primary" @click="toggleCollapse">
            {{ effectiveCollapsed ? '展开' : '收起' }}
            <el-icon
              class="pro-descriptions__collapse-icon"
              :class="{ 'is-expanded': !effectiveCollapsed }"
            >
              <ArrowDown />
            </el-icon>
          </el-button>
        </slot>
      </div>
    </div>

    <slot v-if="requestError" name="error" :error="requestError" :reload="reload">
      <el-alert class="pro-descriptions__error" type="error" show-icon :closable="false">
        <template #title>
          <span>{{ resolvedErrorText }}</span>
          <el-button link type="danger" @click="reload()">{{ retryText }}</el-button>
        </template>
      </el-alert>
    </slot>

    <slot v-if="mergedLoading && !currentData" name="loading">
      <el-skeleton animated :rows="3" />
    </slot>

    <slot v-else-if="!currentData" name="empty">
      <pro-empty :description="resolvedEmptyText" compact />
    </slot>

    <div v-else v-loading="mergedLoading" class="pro-descriptions__body">
      <section v-for="group in renderedGroups" :key="group.key" class="pro-descriptions__group">
        <div v-if="group.title" class="pro-descriptions__group-title">
          <slot :name="`${group.key}Title`" :group="group" :data="currentData">
            {{ group.title }}
          </slot>
        </div>

        <el-descriptions
          v-bind="$attrs"
          :border="resolvedBorder"
          :column="resolvedColumn"
          :direction="direction"
          :size="resolvedSize"
          :label-width="labelWidth"
        >
          <el-descriptions-item
            v-for="item in group.columns"
            :key="String(item.key)"
            :label="item.label"
            :span="item.span as number"
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align"
            :label-align="item.labelAlign"
            :class-name="item.className"
            :label-class-name="item.labelClassName"
          >
            <template #label>
              <slot
                v-if="$slots[`${String(item.key)}-label`]"
                :name="`${String(item.key)}-label`"
                v-bind="createScope(item)"
              />
              <pro-descriptions-custom-label
                v-else-if="item.renderLabel"
                :column="item"
                :scope="createScope(item)"
              />
              <slot v-else name="label" v-bind="createScope(item)">
                <span class="pro-descriptions__label">
                  <span>{{ item.label ?? String(item.key) }}</span>
                  <el-tooltip v-if="item.tooltip" :content="item.tooltip" placement="top">
                    <el-icon class="pro-descriptions__label-tip"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </span>
              </slot>
            </template>

            <div class="pro-descriptions__value">
              <slot
                v-if="$slots[String(item.key)]"
                :name="String(item.key)"
                v-bind="createScope(item)"
              />
              <slot v-else-if="$slots.item" name="item" v-bind="createScope(item)" />
              <pro-descriptions-custom-value
                v-else-if="item.render"
                :column="item"
                :scope="createScope(item)"
              />
              <pro-field
                v-else
                :model-value="getColumnValue(item)"
                :value-type="item.valueType"
                :value-enum="item.valueEnum"
                :options="item.options"
                :option-fields="item.optionFields"
                :field-props="item.fieldProps"
                :empty-text="item.emptyText"
                :formatter="item.formatter"
                mode="read"
              />
              <el-tooltip v-if="item.copyable" content="复制" placement="top">
                <el-button
                  class="pro-descriptions__copy"
                  link
                  :icon="CopyDocument"
                  :aria-label="`复制${item.label ?? String(item.key)}`"
                  @click="copyColumnValue(item)"
                />
              </el-tooltip>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </section>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="
    TRecord extends object = Record<string, unknown>,
    TParams extends object = Record<string, never>
  "
>
import { cloneDeep } from 'lodash-es'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useSlots, watch } from 'vue'
import { ArrowDown, CopyDocument, QuestionFilled } from '@element-plus/icons-vue'
import {
  ElAlert,
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElIcon,
  ElMessage,
  ElSkeleton,
  ElTooltip
} from 'element-plus'
import { ProEmpty } from '../pro-empty'
import { ProField } from '../pro-field'
import { useProConfigProvider } from '../pro-config-provider'
import { isProRequestAbort, useProRequest } from '../shared/pro-request'
import {
  getCollapsedProDescriptionsColumns,
  getProDescriptionsErrorText,
  getProDescriptionsValue,
  getVisibleProDescriptionsColumns,
  groupProDescriptionsColumns,
  resolveProDescriptionsColumnSpan,
  resolveProDescriptionsResponsiveNumber
} from './pro-descriptions-utils'
import type {
  ProDescriptionsColumn,
  ProDescriptionsCopyConfig,
  ProDescriptionsExpose,
  ProDescriptionsProps,
  ProDescriptionsRenderScope
} from './pro-descriptions'

defineOptions({
  name: 'ProDescriptions',
  inheritAttrs: false
})

const props = withDefaults(defineProps<ProDescriptionsProps<TRecord, TParams>>(), {
  data: undefined,
  columns: () => [],
  params: () => ({}) as TParams,
  autoRequest: true,
  direction: 'horizontal',
  groupTitles: () => ({}),
  collapsible: false,
  collapsed: undefined,
  defaultCollapsed: false,
  collapsedRows: 1,
  retryText: '重新加载'
})
const emit = defineEmits<{
  'update:data': [data: TRecord | undefined]
  'update:collapsed': [collapsed: boolean]
  collapse: [collapsed: boolean]
  'loading-change': [loading: boolean]
  'request-state-change': [lifecycle: ReturnType<typeof getRequestLifecycle>]
  'request-error': [error: unknown]
}>()
const slots = useSlots()
const proConfig = useProConfigProvider()

defineSlots<{
  title?: () => unknown
  extra?: (scope: {
    data: TRecord | undefined
    reload: (params?: TParams) => Promise<TRecord | undefined>
    collapsed: boolean
    toggleCollapse: () => void
  }) => unknown
  empty?: () => unknown
  loading?: () => unknown
  error?: (scope: {
    error: unknown
    reload: (params?: TParams) => Promise<TRecord | undefined>
  }) => unknown
  collapse?: (scope: { collapsed: boolean; toggleCollapse: () => void }) => unknown
  label?: (scope: ProDescriptionsRenderScope<TRecord>) => unknown
  item?: (scope: ProDescriptionsRenderScope<TRecord>) => unknown
  [key: string]: ((scope?: any) => unknown) | undefined
}>()

const requestState = useProRequest<TRecord>()
const wrapperRef = ref<HTMLDivElement>()
const currentData = shallowRef<TRecord>()
const requestParams = shallowRef<TParams>(cloneDeep(props.params))
const internalCollapsed = ref(props.defaultCollapsed)
const layoutWidth = ref(1200)
let resizeObserver: ResizeObserver | undefined
const collapsedPreference = computed({
  get: () => props.collapsed ?? internalCollapsed.value,
  set: value => {
    if (props.collapsed === undefined) internalCollapsed.value = value
    emit('update:collapsed', value)
    emit('collapse', value)
  }
})
const mergedLoading = computed(() => props.loading ?? requestState.loading.value)
const requestLifecycle = computed(() => ({
  phase: requestState.phase.value,
  action: requestState.action.value,
  loading: mergedLoading.value,
  initialLoading: requestState.initialLoading.value,
  refreshing: requestState.refreshing.value
}))
const requestError = computed(() => requestState.error.value)
const resolvedErrorText = computed(() =>
  getProDescriptionsErrorText(requestError.value, props.errorText)
)
const resolvedBorder = computed(() => props.border ?? proConfig.value.descriptions?.border ?? true)
const resolvedSize = computed(
  () => props.size ?? proConfig.value.descriptions?.size ?? proConfig.value.size ?? 'default'
)
const resolvedEmptyText = computed(
  () => props.emptyText ?? proConfig.value.descriptions?.emptyText ?? '暂无详情数据'
)
const resolvedColumn = computed(() =>
  resolveProDescriptionsResponsiveNumber(
    props.column ?? proConfig.value.descriptions?.column ?? { xs: 1, sm: 2, md: 3 },
    layoutWidth.value,
    3
  )
)
const resolvedCollapsedRows = computed(() =>
  resolveProDescriptionsResponsiveNumber(props.collapsedRows, layoutWidth.value, 1)
)
const visibleColumns = computed(() =>
  getVisibleProDescriptionsColumns(props.columns, currentData.value).map(column =>
    resolveProDescriptionsColumnSpan(column, layoutWidth.value, resolvedColumn.value)
  )
)
const collapsedColumns = computed(() =>
  getCollapsedProDescriptionsColumns(
    visibleColumns.value,
    resolvedColumn.value,
    resolvedCollapsedRows.value
  )
)
const canCollapse = computed(
  () => props.collapsible && collapsedColumns.value.length < visibleColumns.value.length
)
const effectiveCollapsed = computed(() => collapsedPreference.value && canCollapse.value)
const renderedColumns = computed(() =>
  effectiveCollapsed.value ? collapsedColumns.value : visibleColumns.value
)
const renderedGroups = computed(() =>
  groupProDescriptionsColumns(renderedColumns.value, props.groupTitles)
)
const hasHeader = computed(() =>
  Boolean(props.title || slots.title || slots.extra || canCollapse.value)
)

watch(
  () => props.data,
  data => {
    currentData.value = data ? cloneDeep(data) : undefined
  },
  { immediate: true, deep: true }
)
watch(
  [() => props.request, () => props.params, () => props.autoRequest],
  ([request, params, autoRequest]) => {
    requestParams.value = cloneDeep(params)
    if (request && autoRequest) void reload().catch(() => undefined)
  },
  { immediate: true, deep: true }
)
watch(requestState.loading, loading => emit('loading-change', loading), { immediate: true })
watch(requestLifecycle, lifecycle => emit('request-state-change', { ...lifecycle }), {
  immediate: true
})

onMounted(() => {
  if (!wrapperRef.value) return
  layoutWidth.value = wrapperRef.value.clientWidth || 1200
  resizeObserver = new ResizeObserver(entries => {
    layoutWidth.value = entries[0]?.contentRect.width || layoutWidth.value
  })
  resizeObserver.observe(wrapperRef.value)
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  requestState.cancel()
})

async function reload(params?: TParams, action?: 'initial' | 'refresh' | 'retry') {
  if (params) requestParams.value = cloneDeep(params)
  if (!props.request) return currentData.value

  try {
    const data = await requestState.execute(props.request, cloneDeep(requestParams.value), {
      action: action ?? (currentData.value ? 'refresh' : 'initial'),
      debounce: props.requestDebounce,
      retry: props.requestRetry,
      retryDelay: props.requestRetryDelay
    })
    if (requestState.data.value === data) setData(data)
    return currentData.value
  } catch (error) {
    if (!isProRequestAbort(error)) emit('request-error', error)
    return undefined
  }
}

function retryRequest() {
  return reload(undefined, 'retry')
}

function setData(data?: TRecord) {
  currentData.value = data ? cloneDeep(data) : undefined
  emit('update:data', currentData.value ? cloneDeep(currentData.value) : undefined)
}

function setCollapsed(collapsed: boolean) {
  collapsedPreference.value = collapsed
}

function toggleCollapse() {
  setCollapsed(!collapsedPreference.value)
}

function getRequestLifecycle() {
  return { ...requestLifecycle.value }
}

function getColumnValue(column: ProDescriptionsColumn<TRecord>) {
  return getProDescriptionsValue(currentData.value, column)
}

function createScope(column: ProDescriptionsColumn<TRecord>): ProDescriptionsRenderScope<TRecord> {
  return {
    data: currentData.value as TRecord,
    value: getColumnValue(column),
    column
  }
}

async function copyColumnValue(column: ProDescriptionsColumn<TRecord>) {
  const scope = createScope(column)
  const config: ProDescriptionsCopyConfig<TRecord> =
    typeof column.copyable === 'object' ? column.copyable : {}
  const text =
    typeof config.text === 'function'
      ? config.text(scope)
      : (config.text ?? String(scope.value ?? ''))

  try {
    await copyText(text)
    ElMessage.success(config.successText ?? '复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  if (!copied) throw new Error('Copy is not supported')
}

function ProDescriptionsCustomValue(valueProps: {
  column: ProDescriptionsColumn<TRecord>
  scope: ProDescriptionsRenderScope<TRecord>
}) {
  return valueProps.column.render?.(valueProps.scope) ?? null
}

function ProDescriptionsCustomLabel(valueProps: {
  column: ProDescriptionsColumn<TRecord>
  scope: ProDescriptionsRenderScope<TRecord>
}) {
  return valueProps.column.renderLabel?.(valueProps.scope) ?? null
}

;(ProDescriptionsCustomValue as typeof ProDescriptionsCustomValue & { props: string[] }).props = [
  'column',
  'scope'
]
;(ProDescriptionsCustomLabel as typeof ProDescriptionsCustomLabel & { props: string[] }).props = [
  'column',
  'scope'
]

const exposed: ProDescriptionsExpose<TRecord, TParams> = {
  reload,
  getData: () => (currentData.value ? cloneDeep(currentData.value) : undefined),
  setData,
  getLoading: () => mergedLoading.value,
  getRequestLifecycle,
  getError: () => requestError.value,
  retryRequest,
  cancelRequest: requestState.cancel,
  getCollapsed: () => effectiveCollapsed.value,
  setCollapsed,
  toggleCollapse
}

defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-descriptions {
  min-width: 0;
  color: var(--el-text-color-primary);

  &__header {
    display: flex;
    min-height: 40px;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 12px;
  }

  &__title {
    min-width: 0;
    font-size: var(--el-font-size-medium);
    font-weight: 600;
  }

  &__extra {
    display: flex;
    min-width: 0;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  &__collapse-icon {
    margin-left: 4px;
    transition: transform var(--el-transition-duration-fast);

    &.is-expanded {
      transform: rotate(180deg);
    }
  }

  &__error {
    margin-bottom: 12px;

    :deep(.el-alert__title) {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  }

  &__body {
    min-width: 0;
    min-height: 80px;
  }

  &__group + &__group {
    margin-top: 20px;
  }

  &__group-title {
    margin-bottom: 10px;
    color: var(--el-text-color-primary);
    font-size: var(--el-font-size-base);
    font-weight: 600;
  }

  &__label,
  &__value {
    display: inline-flex;
    min-width: 0;
    align-items: center;
    gap: 6px;
  }

  &__value {
    width: 100%;
  }

  &__label-tip {
    color: var(--el-text-color-secondary);
    cursor: help;
  }

  &__copy {
    flex: none;
    color: var(--el-text-color-secondary);
  }

  :deep(.el-descriptions__body) {
    background-color: var(--el-fill-color-blank);
  }
}
</style>
