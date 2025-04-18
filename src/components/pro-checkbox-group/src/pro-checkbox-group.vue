<template>
  <el-checkbox-group v-bind="$attrs" :model-value="modelValue" @change="changeHandler">
    <component
      :is="renderTagMap[tag]"
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :disabled="option.disabled"
    >
      <slot v-bind="option">{{ option.label }}</slot>
    </component>
  </el-checkbox-group>
</template>
<script setup lang="ts">
import type { ComponentSize } from 'element-plus'
import { ElCheckboxButton, ElCheckbox } from 'element-plus'

interface Option {
  key: string | number
  label: string
  value: string | number
  disabled?: boolean
}

type ModelValue = Option['value'][]

interface IProps {
  modelValue?: ModelValue
  options?: Option[]
  size?: ComponentSize
  tag?: 'checkbox-button' | 'checkbox'
  onChange?: (...args: any[]) => void
}

defineOptions({
  name: 'ProCheckboxGroup'
})

defineSlots<{
  default: (scope: Option) => void
}>()

withDefaults(defineProps<IProps>(), {
  options: () => [],
  tag: 'checkbox'
})

const renderTagMap = {
  'checkbox-button': ElCheckboxButton,
  checkbox: ElCheckbox
}

const emits = defineEmits<{
  'update:model-value': [...rest: any[]]
  change: [...rest: any[]]
}>()

const changeHandler: IProps['onChange'] = (...rest) => {
  emits('update:model-value', rest[0])
  emits('change', ...rest)
}
</script>
