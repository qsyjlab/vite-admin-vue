<template>
  <el-radio-group v-bind="$attrs" :model-value="modelValue" @change="changeHandler">
    <component
      v-for="option in options"
      :is="renderTagMap[tag]"
      :key="option.value"
      :label="option.value"
      :disabled="option.disabled"
    >
      <slot v-bind="option">{{ option.label }}</slot>
    </component>
  </el-radio-group>
</template>
<script setup lang="ts">
import type { ComponentSize } from 'element-plus'
import { ElRadioButton, ElRadio } from 'element-plus'

interface Option {
  key: string | number
  label: string
  value: string | number
  disabled?: boolean
}

type ModelValue = Option['value']

interface IProps {
  modelValue?: ModelValue
  options: Option[]
  size?: ComponentSize
  tag?: 'radio-button' | 'radio'
}

defineOptions({
  name: 'ProRadioGruop'
})

defineSlots<{
  default: (scope: Option) => void
}>()

withDefaults(defineProps<IProps>(), {
  options: () => [],
  tag: 'radio'
})

const renderTagMap = {
  'radio-button': ElRadioButton,
  radio: ElRadio
}

const emits = defineEmits<{
  'update:model-value': [...rest: any[]]
  change: [...rest: any[]]
}>()

const changeHandler: (...args: any[]) => void = (...rest) => {
  emits('update:model-value', rest[0])
  emits('change', ...rest)
}
</script>
