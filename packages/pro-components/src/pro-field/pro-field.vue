<template>
  <span
    ref="fieldRef"
    :class="['pro-field', `pro-field--${mode}`, { 'is-block': block && mode === 'edit' }]"
  >
    <slot
      v-if="mode === 'read'"
      name="read"
      :value="modelValue"
      :text="readText"
      :context="renderContext"
    >
      <component
        :is="customRenderer.read"
        v-if="customRenderer.read"
        v-bind="customRendererProps"
      />

      <el-image
        v-else-if="resolvedValueType.type === 'image' && !empty"
        class="pro-field__image"
        :src="String(modelValue)"
        :preview-src-list="[String(modelValue)]"
        preview-teleported
        v-bind="fieldProps"
      />

      <el-progress
        v-else-if="resolvedValueType.type === 'progress' && !empty"
        :percentage="Number(modelValue) || 0"
        v-bind="fieldProps"
      />

      <el-tag
        v-else-if="['tag', 'status'].includes(resolvedValueType.type) && !empty"
        :type="enumItem?.type"
        :color="enumItem?.color"
        effect="light"
        v-bind="fieldProps"
      >
        {{ readText }}
      </el-tag>

      <span v-else-if="empty" class="pro-field__empty">{{ resolvedEmptyText }}</span>
      <span v-else class="pro-field__text">{{ readText }}</span>
    </slot>

    <slot
      v-else
      name="edit"
      :value="modelValue"
      :context="renderContext"
      :update-value="updateValue"
    >
      <component
        :is="customRenderer.edit || editorComponent"
        v-bind="editorProps"
        @update:model-value="updateValue"
      />
    </slot>
  </span>
</template>

<script setup lang="ts" generic="TValue = unknown, TOption extends object = ProOption">
import { computed, ref, useAttrs, type Component } from 'vue'
import {
  ElDatePicker,
  ElImage,
  ElInput,
  ElInputNumber,
  ElProgress,
  ElSwitch,
  ElTag
} from 'element-plus'
import { ProCheckboxGroup } from '../pro-checkbox-group'
import { ProRadioGroup } from '../pro-radio-group'
import { ProSelect } from '../pro-select'
import { ProUploadList } from '../pro-upload-list'
import { useProConfigProvider } from '../pro-config-provider/pro-config-provider-context'
import { resolveProConfigProviderPopperClass } from '../pro-config-provider/pro-config-provider-utils'
import {
  DEFAULT_PRO_OPTION_FIELDS,
  type ProOption,
  type ProOptionFields
} from '../shared/pro-option'
import type { ProFieldExpose, ProFieldProps, ProFieldRenderContext } from './pro-field'
import { getProFieldRenderer } from './pro-field-registry'
import {
  formatProFieldValue,
  getProFieldEnumItem,
  isProFieldEmpty,
  proFieldEnumToOptions,
  resolveProFieldValueType
} from './pro-field-utils'

defineOptions({
  name: 'ProField',
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<
    ProFieldProps<TValue, TOption> & {
      options?: TOption[]
      optionFields?: Partial<ProOptionFields<TOption>>
      fieldProps?: Record<string, unknown>
    }
  >(),
  {
    mode: 'read',
    valueType: 'text',
    options: () => [],
    optionFields: () => ({}),
    fieldProps: () => ({}),
    block: true
  }
)

const emit = defineEmits<{
  'update:model-value': [value: TValue | undefined]
  change: [value: TValue | undefined]
}>()

const attrs = useAttrs()
const proConfig = useProConfigProvider()

defineSlots<{
  read?: (scope: {
    value: TValue | undefined
    text: unknown
    context: ProFieldRenderContext<TValue, TOption>
  }) => unknown
  edit?: (scope: {
    value: TValue | undefined
    context: ProFieldRenderContext<TValue, TOption>
    updateValue: (value: TValue | undefined) => void
  }) => unknown
}>()

const fieldRef = ref<HTMLElement>()
const value = computed(() => props.modelValue)
const resolvedValueType = computed(() => resolveProFieldValueType(props.valueType))
const mergedOptionFields = computed<ProOptionFields<TOption>>(() => ({
  ...(DEFAULT_PRO_OPTION_FIELDS as ProOptionFields<TOption>),
  ...props.optionFields
}))
const empty = computed(() => isProFieldEmpty(props.modelValue))
const enumItem = computed(() => getProFieldEnumItem(props.valueEnum, props.modelValue))
const normalizedOptions = computed(() =>
  props.options.length ? props.options : (proFieldEnumToOptions(props.valueEnum) as TOption[])
)

const readText = computed(() => {
  const defaultText =
    enumItem.value?.text ??
    formatProFieldValue(
      props.modelValue,
      resolvedValueType.value,
      normalizedOptions.value,
      mergedOptionFields.value
    )

  return props.formatter
    ? props.formatter(props.modelValue as TValue, renderContext.value)
    : defaultText
})

const resolvedEmptyText = computed(() => props.emptyText ?? proConfig.value.field?.emptyText ?? '-')
const customRenderer = computed(
  () =>
    proConfig.value.field?.renderers?.[resolvedValueType.value.type] ??
    getProFieldRenderer(resolvedValueType.value.type) ??
    {}
)

const editorComponent = computed<Component>(() => {
  const componentMap: Record<string, Component> = {
    text: ElInput,
    textarea: ElInput,
    number: ElInputNumber,
    money: ElInputNumber,
    percent: ElInputNumber,
    date: ElDatePicker,
    datetime: ElDatePicker,
    select: ProSelect,
    enum: ProSelect,
    tag: ProSelect,
    status: ProSelect,
    radio: ProRadioGroup,
    checkbox: ProCheckboxGroup,
    switch: ElSwitch,
    upload: ProUploadList
  }

  return componentMap[resolvedValueType.value.type] ?? ElInput
})

const editorProps = computed(() => {
  const type = resolvedValueType.value.type
  const defaults: Record<string, unknown> = {}
  const choiceProps = ['select', 'enum', 'tag', 'status', 'radio', 'checkbox'].includes(type)
    ? {
        options: normalizedOptions.value,
        fields: mergedOptionFields.value
      }
    : {}

  if (type === 'textarea') Object.assign(defaults, { type: 'textarea', rows: 3 })
  if (type === 'money')
    Object.assign(defaults, { precision: resolvedValueType.value.precision ?? 2 })
  if (type === 'percent') Object.assign(defaults, { min: 0, max: 100 })
  if (type === 'date') Object.assign(defaults, { type: 'date', valueFormat: 'YYYY-MM-DD' })
  if (type === 'datetime') {
    Object.assign(defaults, { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' })
  }

  const result: Record<string, unknown> = {
    ...defaults,
    ...props.fieldProps,
    ...attrs,
    modelValue: props.modelValue,
    disabled: props.fieldProps.disabled ?? props.disabled,
    readonly: props.readonly,
    ...choiceProps
  }

  if (['date', 'datetime', 'select', 'enum', 'tag', 'status'].includes(type)) {
    result.popperClass = resolveProConfigProviderPopperClass(
      proConfig.value.dark,
      String(result.popperClass ?? result['popper-class'] ?? '') || undefined
    )
    result.teleported = result.teleported ?? true
  }

  return result
})

const renderContext = computed<ProFieldRenderContext<TValue, TOption>>(() => ({
  value: props.modelValue,
  mode: props.mode,
  valueType: resolvedValueType.value,
  valueEnum: props.valueEnum,
  options: normalizedOptions.value,
  optionFields: mergedOptionFields.value,
  fieldProps: props.fieldProps,
  updateValue
}))

const customRendererProps = computed(() => ({
  ...props.fieldProps,
  value: props.modelValue,
  modelValue: props.modelValue,
  context: renderContext.value,
  'onUpdate:modelValue': updateValue
}))

function updateValue(nextValue: TValue | undefined) {
  emit('update:model-value', nextValue)
  emit('change', nextValue)
}

function getFocusableElement() {
  return fieldRef.value?.querySelector<HTMLElement>(
    'input:not(:disabled), textarea:not(:disabled), button:not(:disabled), [tabindex]:not([tabindex="-1"])'
  )
}

const exposed: ProFieldExpose<TValue> = {
  fieldRef,
  value,
  focus: () => getFocusableElement()?.focus(),
  blur: () => getFocusableElement()?.blur()
}

defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-field {
  min-width: 0;
  color: var(--el-text-color-primary);

  &.is-block {
    display: flex;
    width: 100%;
  }

  &__empty {
    color: var(--el-text-color-placeholder);
  }

  &__text {
    overflow-wrap: anywhere;
  }

  &__image {
    width: 72px;
    height: 72px;
    border-radius: 4px;
  }

  :deep(.el-select),
  :deep(.el-input),
  :deep(.el-input-number),
  :deep(.el-date-editor) {
    width: 100%;
  }
}
</style>
