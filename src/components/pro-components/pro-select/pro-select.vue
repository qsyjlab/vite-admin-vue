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
    :size="size"
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
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
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
import { getProPathValue, type ProPath } from '../shared/pro-path'
import { useProRequest } from '../shared/pro-request'
import type {
  ProSelectExpose,
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
    keywordKey: 'keyword'
  }
)

const emit = defineEmits<{
  'update:model-value': [value: ProSelectModelValue<TValue, TMultiple>]
  change: [value: ProSelectModelValue<TValue, TMultiple>]
  'request-success': [options: TOption[]]
  'request-error': [error: unknown]
}>()

defineSlots<{
  default?: (scope: TOption) => unknown
  option?: (scope: { option: TOption; index: number }) => unknown
  loading?: () => unknown
  empty?: () => unknown
  prefix?: () => unknown
  tag?: (scope: Record<string, unknown>) => unknown
}>()

type ElSelectInstance = InstanceType<typeof ElSelect>

const selectRef = ref<ElSelectInstance>()
const requestOptions = shallowRef<TOption[]>()
const requestState = useProRequest<TOption[]>()
let requestSequence = 0

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
const elementModelValue = computed(
  () => props.modelValue as ProSelectValue | ProSelectValue[] | undefined
)

function getFieldValue<T = unknown>(option: TOption, path: ProPath): T | undefined {
  return getProPathValue<T>(option, path)
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
    ...(props.paramns ?? {}),
    ...(props.params ?? {}),
    ...extra
  } as TParams & ProSelectRequestQuery
}

async function reload(extra: Partial<TParams> & ProSelectRequestQuery = {}) {
  if (!props.request) return renderedOptions.value
  const currentSequence = ++requestSequence

  try {
    const options = await requestState.execute(props.request, getRequestParams(extra))
    if (currentSequence === requestSequence) {
      requestOptions.value = options
      emit('request-success', options)
    }
    return options
  } catch (error) {
    if (currentSequence === requestSequence) {
      requestOptions.value = []
      emit('request-error', error)
    }
    return []
  }
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

watch(
  () => [props.request, props.params, props.paramns] as const,
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

onBeforeUnmount(() => {
  requestSequence += 1
  requestState.cancel()
})

const exposed: ProSelectExpose<TOption, TParams> = {
  selectRef,
  loading: mergedLoading,
  options: renderedOptions,
  reload,
  clearOptions,
  focus: () => selectRef.value?.focus(),
  blur: () => selectRef.value?.blur()
}

defineExpose(exposed)
</script>
