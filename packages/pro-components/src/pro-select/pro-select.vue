<template>
  <el-select
    ref="selectRef"
    v-bind="$attrs"
    :model-value="elementModelValue"
    :clearable="clearable"
    :filterable="filterable"
    :remote="remote"
    :remote-method="handleRemote"
    :multiple="multiple"
    :loading="mergedLoading"
    :size="resolvedSize"
    :popper-class="resolvedPopperClass"
    :teleported="teleported"
    @change="handleChange"
  >
    <template v-if="group">
      <el-option-group
        v-for="(groupItem, groupIndex) in renderedOptions"
        :key="getOptionKey(groupItem, groupIndex)"
        :label="String(getFieldValue(groupItem, mergedFields.label) ?? '')"
      >
        <el-option
          v-for="(option, optionIndex) in getGroupOptions(groupItem)"
          :key="getOptionKey(option, optionIndex)"
          :label="String(getFieldValue(option, mergedFields.label) ?? '')"
          :value="getOptionValue(option)"
          :disabled="Boolean(getFieldValue(option, mergedFields.disabled))"
        >
          <slot name="option" :option="option" :index="optionIndex">
            <slot v-bind="option" />
          </slot>
        </el-option>
      </el-option-group>
    </template>

    <template v-else>
      <el-option
        v-for="(option, optionIndex) in renderedOptions"
        :key="getOptionKey(option, optionIndex)"
        :label="String(getFieldValue(option, mergedFields.label) ?? '')"
        :value="getOptionValue(option)"
        :disabled="Boolean(getFieldValue(option, mergedFields.disabled))"
      >
        <slot name="option" :option="option" :index="optionIndex">
          <slot v-bind="option" />
        </slot>
      </el-option>
    </template>

    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>
    <template #empty>
      <slot name="empty" :error="requestError" :retry="handleRetryRequest">
        <pro-empty
          :status="emptyStatus"
          :description="emptyDescription"
          :action-text="requestError ? '重试' : undefined"
          compact
          @action="handleRetryRequest"
        />
      </slot>
    </template>
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.tag" #tag="scope">
      <slot name="tag" v-bind="scope" />
    </template>
  </el-select>
</template>

<script
  setup
  lang="ts"
  generic="
    TOption extends object = ProSelectOption,
    TValue extends ProSelectValue = ProSelectValue,
    TMultiple extends boolean = false,
    TParams extends ProSelectParams = ProSelectParams
  "
>
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { ElSelect } from 'element-plus'
import ProEmpty from '../pro-empty/pro-empty.vue'
import { useProConfigProvider } from '../pro-config-provider/pro-config-provider-context'
import { resolveProConfigProviderPopperClass } from '../pro-config-provider/pro-config-provider-utils'
import { getProOptionField } from '../shared/pro-option'
import { isProRequestAbort, useProRequest } from '../shared/pro-request'
import {
  createProSelectCacheKey,
  getProSelectCachedRequest,
  invalidateProSelectCache
} from './pro-select-cache'
import type {
  ProSelectExpose,
  ProSelectFieldPath,
  ProSelectFields,
  ProSelectModelValue,
  ProSelectOption,
  ProSelectParams,
  ProSelectProps,
  ProSelectRequestQuery,
  ProSelectValue
} from './pro-select'

defineOptions({
  name: 'ProSelect',
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<
    ProSelectProps<TOption, TValue, TMultiple, TParams> & {
      options?: TOption[]
      clearable?: boolean
      group?: boolean
      fields?: Partial<ProSelectFields<TOption>>
      filterable?: boolean
      keywordKey?: string
    }
  >(),
  {
    options: () => [],
    clearable: true,
    group: false,
    fields: () => ({}),
    filterable: false,
    keywordKey: 'keyword',
    teleported: true,
    cache: false,
    cacheTime: 5 * 60 * 1000
  }
)

const emit = defineEmits<{
  'update:model-value': [value: ProSelectModelValue<TValue, TMultiple>]
  change: [value: ProSelectModelValue<TValue, TMultiple>]
  'request-success': [options: TOption[]]
  'request-state-change': [lifecycle: ReturnType<typeof getRequestLifecycle>]
  'request-error': [error: unknown]
}>()

defineSlots<{
  default?: (scope: TOption) => unknown
  option?: (scope: { option: TOption; index: number }) => unknown
  loading?: () => unknown
  empty?: (scope: { error: unknown; retry: () => Promise<void> }) => unknown
  prefix?: () => unknown
  tag?: (scope: Record<string, unknown>) => unknown
}>()

type ElSelectInstance = InstanceType<typeof ElSelect>

const selectRef = ref<ElSelectInstance>()
const requestOptions = shallowRef<TOption[]>()
const requestState = useProRequest<TOption[]>()
const proConfig = useProConfigProvider()
let requestSequence = 0
const lastRequestExtra = shallowRef<Partial<TParams> & ProSelectRequestQuery>({})

const defaultFields: ProSelectFields<TOption> = {
  label: 'label',
  value: 'value',
  options: 'options',
  disabled: 'disabled'
}

const mergedFields = computed<ProSelectFields<TOption>>(() => ({
  ...defaultFields,
  ...props.fields
}))

const renderedOptions = computed(() => requestOptions.value ?? props.options)
const mergedLoading = computed(() => Boolean(props.loading || requestState.loading.value))
const requestError = computed(() => requestState.error.value)
const emptyStatus = computed(() => {
  if (requestError.value) return 'error'
  return lastRequestExtra.value[props.keywordKey] ? 'search' : 'empty'
})
const emptyDescription = computed(() => {
  if (requestError.value instanceof Error && requestError.value.message) {
    return requestError.value.message
  }
  return undefined
})
const requestLifecycle = computed(() => ({
  phase: requestState.phase.value,
  action: requestState.action.value,
  loading: mergedLoading.value,
  initialLoading: requestState.initialLoading.value,
  refreshing: requestState.refreshing.value
}))
const resolvedSize = computed(() => props.size ?? proConfig.value.size)
const resolvedPopperClass = computed(() =>
  resolveProConfigProviderPopperClass(proConfig.value.dark, props.popperClass)
)
const elementModelValue = computed(
  () => props.modelValue as ProSelectValue | ProSelectValue[] | undefined
)

function getFieldValue<T = unknown>(
  option: TOption,
  path: ProSelectFieldPath<TOption>
): T | undefined {
  return getProOptionField<TOption, T>(option, path)
}

function getGroupOptions(groupOption: TOption): TOption[] {
  const options = getFieldValue<unknown>(groupOption, mergedFields.value.options)
  return Array.isArray(options) ? (options as TOption[]) : []
}

function getOptionValue(option: TOption): ProSelectValue {
  return getFieldValue(option, mergedFields.value.value) as ProSelectValue
}

function getOptionKey(option: TOption, index: number): string | number {
  const value = getFieldValue<unknown>(option, mergedFields.value.value)
  return typeof value === 'string' || typeof value === 'number' ? value : index
}

function getRequestParams(extra: Record<string, unknown> = {}) {
  return {
    ...(props.params ?? {}),
    ...extra
  } as TParams & ProSelectRequestQuery
}

async function reload(
  extra: Partial<TParams> & ProSelectRequestQuery = {},
  force = false,
  action?: 'initial' | 'refresh' | 'retry'
) {
  if (!props.request) return renderedOptions.value
  lastRequestExtra.value = { ...extra }
  const currentSequence = ++requestSequence
  const params = getRequestParams(extra)

  try {
    const execute = () =>
      requestState.execute(props.request!, params, {
        action: action ?? (requestOptions.value === undefined ? 'initial' : 'refresh'),
        debounce: props.requestDebounce,
        retry: props.requestRetry,
        retryDelay: props.requestRetryDelay
      })
    const options = props.cache
      ? await getProSelectCachedRequest(
          createProSelectCacheKey(props.cacheKey ?? 'pro-select', params),
          execute,
          props.cacheTime,
          force
        )
      : await execute()
    if (currentSequence === requestSequence) {
      requestOptions.value = options
      emit('request-success', options)
    }
    return options
  } catch (error) {
    if (currentSequence === requestSequence && !isProRequestAbort(error)) {
      emit('request-error', error)
    }
    return []
  }
}

function retryRequest() {
  return reload(lastRequestExtra.value, true, 'retry')
}

async function handleRetryRequest() {
  await retryRequest()
}

async function handleRemote(query: string) {
  if (props.remoteMethod) {
    requestSequence += 1
    requestState.cancel()
    await props.remoteMethod(query)
    return
  }

  if (props.request) {
    await reload({ [props.keywordKey]: query } as Partial<TParams> & ProSelectRequestQuery)
  }
}

function handleChange(value: ProSelectModelValue<TValue, TMultiple>) {
  emit('update:model-value', value)
  emit('change', value)
}

function clearOptions() {
  requestSequence += 1
  requestState.cancel()
  requestOptions.value = []
}

function clearCache() {
  invalidateProSelectCache(props.cacheKey ?? 'pro-select')
}

watch(
  () => [props.request, props.params] as const,
  () => {
    if (props.request) void reload()
    else {
      requestSequence += 1
      requestState.cancel()
      requestOptions.value = undefined
    }
  },
  { deep: true, immediate: true }
)
watch(requestLifecycle, lifecycle => emit('request-state-change', { ...lifecycle }), {
  immediate: true
})

onBeforeUnmount(() => {
  requestSequence += 1
  requestState.cancel()
})

function getRequestLifecycle() {
  return { ...requestLifecycle.value }
}

const exposed: ProSelectExpose<TOption, TParams> = {
  selectRef,
  loading: mergedLoading,
  options: renderedOptions,
  getRequestLifecycle,
  getError: () => requestState.error.value,
  retryRequest,
  cancelRequest: reason => {
    requestSequence += 1
    requestState.cancel(reason)
  },
  reload,
  clearCache,
  clearOptions,
  focus: () => selectRef.value?.focus(),
  blur: () => selectRef.value?.blur()
}

defineExpose(exposed)
</script>
