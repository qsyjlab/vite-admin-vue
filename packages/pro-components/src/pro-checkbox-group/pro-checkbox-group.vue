<template>
  <el-checkbox-group
    ref="groupRef"
    v-bind="$attrs"
    :model-value="elementModelValue"
    :size="resolvedSize"
    :disabled="disabled"
    :min="min"
    :max="max"
    @change="handleChange"
  >
    <component
      :is="optionComponent"
      v-for="(option, index) in options"
      :key="getOptionKey(option, index)"
      :value="getOptionValue(option)"
      :disabled="isOptionDisabled(option)"
    >
      <slot
        name="option"
        :option="option"
        :index="index"
        :selected="modelValue?.includes(getOptionValue(option)) ?? false"
      >
        <slot v-bind="option">{{ getOptionLabel(option) }}</slot>
      </slot>
    </component>
  </el-checkbox-group>
</template>

<script
  setup
  lang="ts"
  generic="TOption extends object = ProOption, TValue extends ProCheckboxValue = ProCheckboxValue"
>
import { computed, ref } from 'vue'
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup } from 'element-plus'
import { useProConfigProvider } from '../pro-config-provider'
import {
  DEFAULT_PRO_OPTION_FIELDS,
  getProOptionField,
  getProOptionKey,
  type ProChoiceValue,
  type ProOption,
  type ProOptionFields
} from '../shared/pro-option'
import type {
  ProCheckboxGroupExpose,
  ProCheckboxGroupProps,
  ProCheckboxValue
} from './pro-checkbox-group'

defineOptions({
  name: 'ProCheckboxGroup',
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<
    ProCheckboxGroupProps<TOption, TValue> & {
      options?: TOption[]
      fields?: Partial<ProOptionFields<TOption>>
      optionType?: 'default' | 'button'
    }
  >(),
  {
    options: () => [],
    fields: () => ({}),
    optionType: 'default'
  }
)

const emit = defineEmits<{
  'update:model-value': [value: TValue[]]
  change: [value: TValue[]]
}>()

defineSlots<{
  default?: (scope: TOption) => unknown
  option?: (scope: { option: TOption; index: number; selected: boolean }) => unknown
}>()

type CheckboxGroupInstance = InstanceType<typeof ElCheckboxGroup>

const groupRef = ref<CheckboxGroupInstance>()
const value = computed(() => props.modelValue ?? [])
const elementModelValue = computed(() => props.modelValue as ProCheckboxValue[] | undefined)
const proConfig = useProConfigProvider()
const resolvedSize = computed(() => props.size ?? proConfig.value.size)

const mergedFields = computed<ProOptionFields<TOption>>(() => ({
  ...(DEFAULT_PRO_OPTION_FIELDS as ProOptionFields<TOption>),
  ...props.fields
}))

const optionComponent = computed(() => {
  if (props.optionType === 'button') return ElCheckboxButton
  return ElCheckbox
})

function getOptionLabel(option: TOption) {
  return String(getProOptionField(option, mergedFields.value.label) ?? '')
}

function getOptionValue(option: TOption): TValue {
  return getProOptionField<TOption, TValue>(option, mergedFields.value.value) as TValue
}

function isOptionDisabled(option: TOption) {
  return Boolean(getProOptionField(option, mergedFields.value.disabled))
}

function getOptionKey(option: TOption, index: number) {
  return getProOptionKey(option, mergedFields.value.value, index)
}

function handleChange(nextValue: ProChoiceValue[]) {
  const typedValue = nextValue as TValue[]
  emit('update:model-value', typedValue)
  emit('change', typedValue)
}

function getFocusableInput() {
  const root = groupRef.value?.$el as HTMLElement | undefined
  return root?.querySelector<HTMLInputElement>('input:not(:disabled)')
}

const exposed: ProCheckboxGroupExpose<TValue> = {
  groupRef,
  value,
  focus: () => getFocusableInput()?.focus(),
  blur: () => getFocusableInput()?.blur()
}

defineExpose(exposed)
</script>
